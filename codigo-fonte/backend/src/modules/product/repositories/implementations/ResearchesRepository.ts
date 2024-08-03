import { UUID } from "crypto";
import { ILike, Repository, getRepository } from "typeorm";
import { utils, write, writeFile } from "xlsx";

import { Research } from "../../entities/Research";
import {
  ICreateResearchDTO,
  IResearchesRepository,
} from "../IResearchesRepository";

class ResearchesRepository implements IResearchesRepository {
  private repository: Repository<Research>;

  constructor() {
    this.repository = getRepository(Research);
  }

  async list(page?: number, perPage?: number): Promise<Research[]> {
    const researches = await this.repository.find({
      take: perPage > 0 ? perPage : 10,
      skip: page > 0 ? (page - 1) * perPage : 0,
      order: { created_at: "DESC" },
      relations: ["market", "product", "product.category", "market.city"],
    });

    return researches;
  }

  async meanMonthIndex(year: number) {
    try {
      const prevMonth = await getRepository(Research)
        .createQueryBuilder("research")
        .select("AVG(research.price)", "mean")
        .addSelect("EXTRACT(MONTH FROM research.created_at)", "month")
        .addSelect("EXTRACT(YEAR FROM research.created_at)", "year")
        .addSelect("city.id", "cityId")
        .addSelect("city.name", "cityName")
        .addSelect("category.name", "category")
        .leftJoin("research.market", "market")
        .leftJoin("market.city", "city")
        .leftJoin("research.product", "product")
        .leftJoin("product.category", "category")
        .where("EXTRACT(YEAR FROM research.created_at) = :year", {
          year: year - 1,
        })
        .andWhere("EXTRACT(MONTH FROM research.created_at) = 12")
        .groupBy("city.id, city.name, category, year, month")

        .getRawMany();

      let researches = await getRepository(Research)
        .createQueryBuilder("research")
        .select("AVG(research.price)", "mean")
        .addSelect("EXTRACT(MONTH FROM research.created_at)", "month")
        .addSelect("EXTRACT(YEAR FROM research.created_at)", "year")
        .addSelect("city.name", "cityName")
        .addSelect("category.name", "category")
        .leftJoin("research.market", "market")
        .leftJoin("market.city", "city")
        .leftJoin("research.product", "product")
        .leftJoin("product.category", "category")
        .where("EXTRACT(YEAR FROM research.created_at) = :year", { year })
        .groupBy("city.id, city.name, year, month, category")
        .getRawMany();

      researches = [...prevMonth, ...researches];

      const previousMonthMeans: { [key: string]: number } = {};
      const result: any[] = [];

      researches.forEach((research, index) => {
        const currentMonthMean = Number(research.mean.toFixed(2));
        const { cityName } = research;
        const categoryName = research.category;

        const previousMonthMean = previousMonthMeans[categoryName] ?? null;

        const nextMonthMean =
          index < researches.length - 1
            ? Number(researches[index + 1].mean.toFixed(2))
            : null;

        const difference = previousMonthMean
          ? (
              ((currentMonthMean - previousMonthMean) / previousMonthMean) *
              100
            ).toFixed(2)
          : null;

        previousMonthMeans[categoryName] = currentMonthMean;

        result.push({
          city: cityName,
          month: research.month,
          year,
          name: categoryName,
          mean: currentMonthMean,
          difference,
          nextMonthMean,
        });
      }, {});

      const monthsTotals: { [key: string]: number } = {};
      result.forEach((entry) => {
        const monthKey = `${entry.year}-${entry.month}`;
        monthsTotals[monthKey] = (monthsTotals[monthKey] || 0) + entry.mean;
      });

      const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];

      const getMonthName = (monthNumber) => {
        return monthNames[parseInt(monthNumber, 10) - 1];
      };

      const returnResult = result.reduce((acc, curr) => {
        const { city, difference, month, name } = curr;

        if (difference === null) return acc;

        if (!acc[name]) {
          acc[name] = {
            id: name,
            city,
            data: [],
          };
        }

        acc[name].data.push({ x: getMonthName(month), y: difference });

        return acc;
      }, {});

      // eslint-disable-next-line @typescript-eslint/naming-convention
      interface MonthlySums {
        [month: string]: number;
      }

      // eslint-disable-next-line @typescript-eslint/naming-convention
      interface CitySums {
        id: string;
        data: { x: string; y: number }[];
      }

      const citySums: { [city: string]: MonthlySums } = {};

      Object.values(returnResult).forEach(({ city, data }) => {
        if (!citySums[city]) {
          citySums[city] = {};
        }

        data.forEach(({ x: month, y: value }) => {
          const numValue = parseFloat(value);
          if (!citySums[city][month]) {
            citySums[city][month] = 0;
          }
          citySums[city][month] += numValue;
        });
      });

      const formattedResult: CitySums[] = Object.entries(citySums).map(
        ([city, monthlySums]) => ({
          id: city,
          data: Object.entries(monthlySums).map(([month, value]) => ({
            x: month,
            y: value.toFixed(2),
          })),
        }),
      );

      return formattedResult;
    } catch (error) {
      console.log(error);
    }
  }

  async meanMonthByCity(year: number, city?: string) {
    try {
      const prevMonth = await this.repository
        .createQueryBuilder("research")
        .select("AVG(research.price)", "mean")
        .addSelect("EXTRACT(MONTH FROM research.created_at)", "month")
        .addSelect("EXTRACT(YEAR FROM research.created_at)", "year")
        .addSelect("category.color", "color")
        .addSelect("category.name", "category")
        .leftJoin("research.product", "product")
        .leftJoin("product.category", "category")
        .leftJoin("research.market", "market")
        .leftJoin("market.city", "city")
        .where("EXTRACT(YEAR FROM research.created_at) = :year", {
          year: year - 1,
        })
        .andWhere("EXTRACT(MONTH FROM research.created_at) = 12")
        .andWhere("city.name = :city", { city })
        .groupBy("category, year, month, color")
        .getRawMany();

      let researches = await this.repository
        .createQueryBuilder("research")
        .select("AVG(research.price)", "mean")
        .addSelect("EXTRACT(MONTH FROM research.created_at)", "month")
        .addSelect("EXTRACT(YEAR FROM research.created_at)", "year")
        .addSelect("category.color", "color")
        .addSelect("category.name", "category")
        .leftJoin("research.product", "product")
        .leftJoin("product.category", "category")
        .leftJoin("research.market", "market")
        .leftJoin("market.city", "city")
        .where("EXTRACT(YEAR FROM research.created_at) = :year", { year })
        .andWhere("city.name = :city", { city })
        .groupBy("category, year, month, color")
        .getRawMany();

      researches = [...prevMonth, ...researches];

      const previousMonthMeans: { [key: string]: number } = {};
      const result: any[] = [];

      researches.forEach((research, index) => {
        const currentMonthMean = Number(research.mean.toFixed(2));
        const categoryName = research.category;

        const previousMonthMean = previousMonthMeans[categoryName] ?? null;

        const nextMonthMean =
          index < researches.length - 1
            ? Number(researches[index + 1].mean.toFixed(2))
            : null;

        const difference = previousMonthMean
          ? (
              ((currentMonthMean - previousMonthMean) / previousMonthMean) *
              100
            ).toFixed(2)
          : null;

        previousMonthMeans[categoryName] = currentMonthMean;

        result.push({
          month: research.month,
          year,
          name: categoryName,
          color: research.color,
          mean: currentMonthMean,
          difference,
          nextMonthMean,
        });
      }, {});

      const monthsTotals: { [key: string]: number } = {};
      result.forEach((entry) => {
        const monthKey = `${entry.year}-${entry.month}`;
        monthsTotals[monthKey] = (monthsTotals[monthKey] || 0) + entry.mean;
      });

      Object.entries(monthsTotals).forEach(([monthKey, totalMean]) => {
        const [year, month] = monthKey.split("-");
        result.push({
          month,
          year,
          name: "Total",
          color: 109,
          mean: totalMean,
          difference: null,
        });
      });

      const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];

      const getMonthName = (monthNumber) => {
        return monthNames[parseInt(monthNumber, 10) - 1];
      };

      const returnResult = result.reduce((acc, curr) => {
        const { color, difference, month, name } = curr;

        // Descartar itens com difference = null
        if (difference === null) return acc;

        if (!acc[name]) {
          acc[name] = {
            id: name,
            color,
            data: [],
          };
        }

        acc[name].data.push({ x: getMonthName(month), y: difference });

        return acc;
      }, {});

      const totais = {
        id: "Total",
        color: 109,
        data: [],
      };

      Object.values(returnResult).forEach((category) => {
        category.data.forEach((data, index) => {
          if (!totais.data[index]) {
            totais.data[index] = { x: data.x, y: 0 };
          }

          totais.data[index].y = parseFloat(
            (parseFloat(totais.data[index].y) + parseFloat(data.y)).toString(),
          ).toFixed(2);
        });
      });

      const finalResult = Object.values(returnResult);
      finalResult.push(totais);

      return finalResult;
    } catch (error) {
      console.log(error);
    }
  }

  async meanProductIndexByCategory(
    year: number,
    category: string,
    city?: string,
  ) {
    try {
      const preveMonth = await this.repository
        .createQueryBuilder("research")
        .select("AVG(research.price)", "mean")
        .addSelect("EXTRACT(MONTH FROM research.created_at)", "month")
        .addSelect("EXTRACT(YEAR FROM research.created_at)", "year")
        .addSelect("categoryForColor.color", "color")
        .addSelect("product.name", "name")
        .leftJoin("research.product", "product")
        .leftJoin("product.category", "categoryForColor")
        .leftJoin("research.market", "market")
        .leftJoin("market.city", "city")
        .where("EXTRACT(YEAR FROM research.created_at) = :year", {
          year: year - 1,
        })
        .andWhere("EXTRACT(MONTH FROM research.created_at) = 12")
        .andWhere("product.category = :category", { category })
        .andWhere("city.name = :city", { city })
        .groupBy("year, month, product.name, color")
        .orderBy("year, month, product.name, color")
        .getRawMany();

      let researches = await this.repository
        .createQueryBuilder("research")
        .select("AVG(research.price)", "mean")
        .addSelect("EXTRACT(MONTH FROM research.created_at)", "month")
        .addSelect("categoryForColor.color", "color")
        .addSelect("product.name", "name")
        .leftJoin("research.product", "product")
        .leftJoin("product.category", "categoryForColor")
        .leftJoin("research.market", "market")
        .leftJoin("market.city", "city")
        .where("EXTRACT(YEAR FROM research.created_at) = :year", { year })
        .andWhere("product.category = :category", { category })
        .andWhere("city.name = :city", { city })
        .groupBy("month, product.name, color")
        .orderBy("month, product.name, color")
        .getRawMany();

      researches = [...preveMonth, ...researches];

      const previousMonthMeans: { [key: string]: number } = {};
      const result: any[] = [];

      researches.forEach((research, index) => {
        const currentMonthMean = Number(research.mean.toFixed(2));
        const productName = research.name;

        const previousMonthMean = previousMonthMeans[productName] ?? null;
        const nextMonthMean =
          index < researches.length - 1
            ? Number(researches[index + 1].mean.toFixed(2))
            : null;

        const difference = previousMonthMean
          ? (
              ((currentMonthMean - previousMonthMean) / previousMonthMean) *
              100
            ).toFixed(2)
          : null;

        previousMonthMeans[productName] = currentMonthMean;

        result.push({
          month: research.month,
          year,
          name: productName,
          color: research.color,
          mean: currentMonthMean,
          difference,
          nextMonthMean,
        });
      });

      const monthsTotals: { [key: string]: number } = {};
      result.forEach((entry) => {
        const monthKey = `${entry.year}-${entry.month}`;
        monthsTotals[monthKey] = (monthsTotals[monthKey] || 0) + entry.mean;
      });

      Object.entries(monthsTotals).forEach(([monthKey, totalMean]) => {
        const [year, month] = monthKey.split("-");
        result.push({
          month,
          year,
          name: "Total",
          color: 109,
          mean: totalMean,
          difference: null,
        });
      });

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async create({
    market,
    product,
    price,
    created_at,
  }: ICreateResearchDTO): Promise<void> {
    const research = this.repository.create({
      market,
      product,
      price,
      created_at,
    });

    await this.repository.save(research);
  }

  async delete(id: UUID): Promise<void> {
    const research = await this.repository.findOne({ where: { id } });

    await this.repository.remove(research);
  }

  async update(id: UUID, data: ICreateResearchDTO): Promise<void> {
    const research = await this.repository.findOne({ where: { id } });

    if (!research) {
      throw new Error("Pesquisa não encontrada");
    }

    research.market = data.market;
    research.price = data.price;
    research.product = data.product;

    await this.repository.save(research);
  }

  async findById(id: UUID): Promise<Research | undefined> {
    const research = await this.repository.findOne({
      where: { id },
      relations: ["market", "product"],
    });

    return research;
  }

  async findByData(data: string): Promise<Research[]> {
    const researchs = await this.repository.find({
      order: { created_at: "DESC" },
      relations: [
        "market",
        "market.city",
        "product",
        "product.category",
        "product.barcode",
      ],
    });

    return researchs.filter((r) =>
      r.created_at.toISOString().substring(0, 10).includes(data),
    );
  }

  async findByDataToExcel(data: string): Promise<Buffer> {
    const researches = await this.findByData(data);

    const dados = researches.map((research) => {
      return {
        Cidade: `${research.market.city.name}/${research.market.city.state}`,
        Mercado: research.market.name,
        Categoria: research.product.category.name,
        Produto: research.product.name,
        Preço: research.price.toFixed(2).replace(".", ","),
        Data: data,
      };
    });

    const worksheet = utils.json_to_sheet(dados);

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = write(workbook, { bookType: "xlsx", type: "buffer" });

    return excelBuffer;
  }
}

export { ResearchesRepository };
