import { inject, injectable } from "tsyringe";

import { Category } from "../../../entities/Category";
import { IProductsRepository } from "../../../repositories/IProductsRepository";

interface IRequest {
  name: string;
  category: Category;
}

@injectable()
class CreateProductUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}

  async execute({ name, category }: IRequest): Promise<void> {
    this.productsRepository.create({
      name,
      category,
    });
  }
}

export { CreateProductUseCase };
