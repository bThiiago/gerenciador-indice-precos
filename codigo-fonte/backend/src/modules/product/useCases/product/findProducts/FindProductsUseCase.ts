import { inject, injectable } from "tsyringe";

import { Product } from "../../../entities/Product";
import { IProductsRepository } from "../../../repositories/IProductsRepository";

@injectable()
class FindProductsUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}

  async execute(name: string): Promise<Product[] | null> {
    const product = await this.productsRepository.find(name);

    return product;
  }

  async executeById(id: string): Promise<Product | undefined> {
    const product = await this.productsRepository.findById(id);

    return product;
  }
}

export { FindProductsUseCase };
