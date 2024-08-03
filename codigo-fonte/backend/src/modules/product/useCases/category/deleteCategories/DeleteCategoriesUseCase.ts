import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { ICategoriesRepository } from "../../../repositories/ICategoriesRepository";

@injectable()
class DeleteCategoriesUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // Verifique se a categoria existe
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new AppError("Categoria não encontrado");
    }

    await this.categoriesRepository.delete(id);
  }
}

export { DeleteCategoriesUseCase };
