import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { FindBarcodeUseCase } from "./FindBarcodeUseCase";

class FindBarcodeController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { barcode } = request.params;

    const findBarcodeUseCase = container.resolve(FindBarcodeUseCase);

    const product = await findBarcodeUseCase.execute(barcode);

    if (!product) {
      return response.json({ message: "Produto não encontrado" });
    }

    return response.json(product);
  }
}

export { FindBarcodeController };
