import { inject, injectable } from "tsyringe";

import { Barcode } from "../../../entities/Barcode";
import { IBarcodesRepository } from "../../../repositories/IBarcodesRepository";

@injectable()
class FindBarcodeUseCase {
  constructor(
    @inject("BarcodesRepository")
    private barcodesRepository: IBarcodesRepository,
  ) {}

  async executeById(id: string): Promise<Barcode | undefined> {
    const barcode = await this.barcodesRepository.findById(id);

    return barcode;
  }

  async executeByCode(code: string): Promise<Barcode | null> {
    const barcode = await this.barcodesRepository.findByCode(code);

    return barcode;
  }

  async executeByProduct(product: string): Promise<Barcode[] | null> {
    const barcode = await this.barcodesRepository.findByProduct(product);

    return barcode;
  }
}

export { FindBarcodeUseCase };
