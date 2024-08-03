import { inject, injectable } from "tsyringe";

import { Category } from "../../../entities/Category";
import { ICategoriesRepository } from "../../../repositories/ICategoriesRepository";

@injectable()
class FindCategoriesUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(name: string): Promise<Category[] | null> {
    const category = await this.categoriesRepository.find(name);

    return category;
  }

  async executeById(id: string): Promise<Category | undefined> {
    const category = await this.categoriesRepository.findById(id);

    return category;
  }
}

export { FindCategoriesUseCase };
