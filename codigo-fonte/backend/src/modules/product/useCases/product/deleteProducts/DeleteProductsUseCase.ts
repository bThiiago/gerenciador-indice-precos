import { UUID } from "crypto";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { IProductsRepository } from "../../../repositories/IProductsRepository";

@injectable()
class DeleteProductsUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError("Produto não encontrado");
    }

    await this.productsRepository.delete(id);
  }
}

export { DeleteProductsUseCase };
