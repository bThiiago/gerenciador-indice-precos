import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { Product } from "../../../entities/Product";
import { IBarcodesRepository } from "../../../repositories/IBarcodesRepository";

interface IRequest {
  code: string;
  product: Product;
}

@injectable()
class CreateBarcodeUseCase {
  constructor(
    @inject("BarcodesRepository")
    private barcodesRepository: IBarcodesRepository,
  ) {}

  async execute({ code, product }: IRequest): Promise<void> {
    const categoryAlreadyExists =
      await this.barcodesRepository.findByCode(code);

    if (categoryAlreadyExists) {
      throw new AppError("Código de barras já inserido");
    }

    this.barcodesRepository.create({ code, product });
  }
}

export { CreateBarcodeUseCase };
