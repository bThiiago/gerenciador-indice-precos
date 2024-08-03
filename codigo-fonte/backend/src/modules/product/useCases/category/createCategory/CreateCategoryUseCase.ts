import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { ICategoriesRepository } from "../../../repositories/ICategoriesRepository";

interface IRequest {
  name: string;
  barcode: boolean;
  color: number;
}

@injectable()
class CreateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute({ barcode, name, color }: IRequest): Promise<void> {
    const categoryAlreadyExists =
      await this.categoriesRepository.findByName(name);

    if (categoryAlreadyExists) {
      throw new AppError("Categoria já existe");
    }

    this.categoriesRepository.create({ name, barcode, color });
  }
}

export { CreateCategoryUseCase };
