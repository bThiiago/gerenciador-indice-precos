import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { ICategoriesRepository } from "../../../repositories/ICategoriesRepository";

interface IRequest {
  name: string;
  barcode: boolean;
  color: number;
}

@injectable()
class UpdateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute(id: string, { name, barcode, color }: IRequest): Promise<void> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new AppError("Categoria não encontrada");
    }

    if (name !== category.name) {
      const categoryAlreadyExists =
        await this.categoriesRepository.findByName(name);

      if (categoryAlreadyExists && categoryAlreadyExists.id !== category.id) {
        throw new AppError("Categoria já existe");
      }

      category.name = name;
    }

    category.barcode = barcode;
    category.color = color;

    await this.categoriesRepository.update(id, {
      name: category.name,
      barcode: category.barcode,
      color: category.color,
    });
  }
}

export { UpdateCategoryUseCase };
