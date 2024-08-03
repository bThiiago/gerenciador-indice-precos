import { inject, injectable } from "tsyringe";

import { Product } from "../../../entities/Product";
import { IProductsRepository } from "../../../repositories/IProductsRepository";

@injectable()
class ListProductsUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}

  async execute(
    page: number,
    perPage: number,
    category: string,
  ): Promise<Product[]> {
    const products = await this.productsRepository.list(
      page,
      perPage,
      category,
    );

    return products;
  }
}

export { ListProductsUseCase };
