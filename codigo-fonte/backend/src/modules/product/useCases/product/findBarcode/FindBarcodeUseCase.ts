import { inject, injectable } from "tsyringe";

import { Product } from "../../../entities/Product";
import { IProductsRepository } from "../../../repositories/IProductsRepository";

@injectable()
class FindBarcodeUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository,
  ) {}

  async execute(barcode: string): Promise<Product | null> {
    const product = await this.productsRepository.findBarcode(barcode);

    return product;
  }
}

export { FindBarcodeUseCase };
