import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { Category } from "../../../entities/Category";
import { IProductsRepository } from "../../../repositories/IProductsRepository";

interface IRequest {
  name: string;
  category: Category;
}

@injectable()
class UpdateProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}

  async execute(id: string, { name, category }: IRequest): Promise<void> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError("Produto não encontrado");
    }

    product.name = name;
    product.category = category;

    await this.productsRepository.update(id, {
      name: product.name,
      category: product.category,
    });
  }
}

export { UpdateProductUseCase };
