import { UUID } from "crypto";
import { ILike, Repository, getRepository } from "typeorm";

import { Market } from "../../entities/Market";
import { ICreateMarketDTO, IMarketsRepository } from "../IMarketsRepository";

class MarketsRepository implements IMarketsRepository {
  private repository: Repository<Market>;

  constructor() {
    this.repository = getRepository(Market);
  }

  async create({ name, city }: ICreateMarketDTO): Promise<void> {
    const market = this.repository.create({
      name,
      city,
    });
    await this.repository.save(market);
  }

  async update(id: UUID, data: ICreateMarketDTO): Promise<void> {
    const market = await this.repository.findOne({
      where: { id },
    });

    if (!market) {
      throw new Error("Mercado não encontrado ");
    }

    market.name = data.name;
    market.city = data.city;

    await this.repository.save(market);
  }

  async delete(id: UUID): Promise<void> {
    const market = await this.repository.findOne({ where: { id } });

    await this.repository.delete({ id });
  }

  async list(city?: string): Promise<Market[]> {
    const query: any = {
      relations: ["city"],
    };

    if (city !== "undefined") {
      query.where = { city };
    }

    const markets = await this.repository.find(query);

    return markets;
  }

  async find(name: string): Promise<Market[]> {
    const market = await this.repository.find({
      relations: ["city"],
      where: {
        name: ILike(`%${name}%`),
      },
    });

    return market;
  }

  async findByName(name: string): Promise<Market> {
    const market = await this.repository.findOne({
      relations: ["city"],
      where: {
        name: ILike(`${name}`),
      },
    });

    return market;
  }

  async findById(id: UUID): Promise<Market | undefined> {
    const market = await this.repository.findOne({
      relations: ["city"],
      where: { id },
    });

    return market;
  }
}

export { MarketsRepository };
