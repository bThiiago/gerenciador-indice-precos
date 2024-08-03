import { UUID } from "crypto";
import { ILike, Repository, getRepository } from "typeorm";

import { Category } from "../../entities/Category";
import {
  ICategoriesRepository,
  ICreateCategoryDTO,
} from "../ICategoriesRepository";

class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async create({ barcode, name, color }: ICreateCategoryDTO): Promise<void> {
    const category = this.repository.create({
      barcode,
      name,
      color,
    });

    await this.repository.save(category);
  }

  async delete(id: UUID): Promise<void> {
    const category = await this.repository.findOne({
      where: {
        id,
      },
    });

    await this.repository.delete(category);
  }

  async list(): Promise<Category[]> {
    const categories = await this.repository.find({
      order: { name: "ASC" },
      relations: ["products"],
    });

    return categories;
  }

  async update(id: UUID, data: ICreateCategoryDTO): Promise<void> {
    const category = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    category.name = data.name;
    category.barcode = data.barcode;
    category.color = data.color;

    await this.repository.save(category);
  }

  async find(name: string): Promise<Category[]> {
    const categories = await this.repository.find({
      where: {
        name: ILike(`%${name}%`),
      },
      relations: ["products"],
    });

    return categories;
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.repository.findOne({
      where: {
        name: ILike(`${name}`),
      },
      relations: ["products"],
    });

    return category;
  }

  async findById(id: UUID): Promise<Category | undefined> {
    const category = await this.repository.findOne({
      where: {
        id,
      },
      relations: ["products"],
    });

    return category;
  }
}

export { CategoriesRepository };
