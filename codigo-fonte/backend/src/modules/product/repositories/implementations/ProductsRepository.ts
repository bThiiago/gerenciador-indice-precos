import { UUID } from "crypto";
import { ILike, Repository, getRepository } from "typeorm";

import { Product } from "../../entities/Product";
import { ICreateProductDTO, IProductsRepository } from "../IProductsRepository";

class ProductsRepository implements IProductsRepository {
  private repository: Repository<Product>;

  constructor() {
    this.repository = getRepository(Product);
  }

  async create({
    name,
    category,
    created_at,
  }: ICreateProductDTO): Promise<void> {
    const product = this.repository.create({
      name,
      category,
      created_at,
    });
    await this.repository.save(product);
  }

  async delete(id: UUID): Promise<void> {
    const product = await this.repository.findOne({
      relations: ["category"],
      where: { id },
    });

    await this.repository.delete(product.id);
  }

  async update(idTes: string, data: ICreateProductDTO): Promise<void> {
    const product = await this.repository.findOne({
      relations: ["category"],
      where: { id: idTes },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    product.name = data.name;
    product.category = data.category;

    await this.repository.save(product);
  }

  async list(
    page?: number,
    perPage?: number,
    category?: string,
  ): Promise<Product[]> {
    const query: any = {
      take: perPage > 0 ? perPage : null,
      skip: page > 0 ? (page - 1) * perPage : null,
      order: { name: "ASC" },
      relations: ["category", "barcode"],
    };

    if (category !== "undefined") {
      query.where = {
        category: {
          id: category,
        },
      };
    }

    const products = await this.repository.find(query);

    return products;
  }

  async find(name: string): Promise<Product[]> {
    const products = await this.repository.find({
      relations: ["category", "barcode"],
      where: {
        name: ILike(`%${name}%`),
      },
      order: { created_at: "DESC" },
    });

    return products;
  }

  async findByName(name: string): Promise<Product> {
    const product = await this.repository.findOne({
      relations: ["category", "researchs", "barcode"],
      where: {
        name: ILike(`%${name}%`),
      },
    });

    return product;
  }

  async findBarcode(barcode: string): Promise<Product | null> {
    const product = await this.repository.findOne({
      relations: ["category", "barcode"],
      where: {
        barcode: {
          code: barcode,
        },
      },
    });

    return product || null;
  }

  async findById(idTeste: string): Promise<Product | undefined> {
    const product = await this.repository.findOne({
      relations: ["category", "barcode"],
      where: { id: idTeste },
    });

    return product;
  }
}

export { ProductsRepository };
