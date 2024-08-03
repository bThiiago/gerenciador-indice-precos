import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { IBarcodesRepository } from "../../../repositories/IBarcodesRepository";

@injectable()
class DeleteBarcodeUseCase {
  constructor(
    @inject("BarcodesRepository")
    private barcodesRepository: IBarcodesRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const barcode = await this.barcodesRepository.findById(id);
    if (!barcode) {
      throw new AppError("Código de barras não encontrado");
    }

    await this.barcodesRepository.delete(id);
  }
}

export { DeleteBarcodeUseCase };
