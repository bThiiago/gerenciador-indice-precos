import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { FindBarcodeUseCase } from "./FindBarcodeUseCase";

class FindBarcodeController {
  async handleById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findBarcodeUseCase = container.resolve(FindBarcodeUseCase);

    const barcode = await findBarcodeUseCase.executeById(id);

    if (!barcode) {
      return response.json({ message: "Código de barras não encontrado" });
    }

    return response.json(barcode);
  }

  async handleByCode(request: Request, response: Response): Promise<Response> {
    const { code } = request.params;

    const findBarcodeUseCase = container.resolve(FindBarcodeUseCase);

    const barcode = await findBarcodeUseCase.executeByCode(code);

    if (!barcode) {
      return response.json({ message: "Código de barras não encontrado" });
    }

    return response.json(barcode);
  }

  async handleByProduct(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { product } = request.params;

    const findBarcodeUseCase = container.resolve(FindBarcodeUseCase);

    const barcode = await findBarcodeUseCase.executeByProduct(product);

    if (!barcode) {
      return response.json({ message: "Código de barras não encontrado" });
    }

    return response.json(barcode);
  }
}

export { FindBarcodeController };
