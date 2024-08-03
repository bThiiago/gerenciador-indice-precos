import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { CreateBarcodeUseCase } from "./CreateBarcodeUseCase";

class CreateBarcodeController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { code, product } = request.body;

    const createBarcodeUseCase = container.resolve(CreateBarcodeUseCase);

    try {
      await createBarcodeUseCase.execute({ code, product });
      return response.send();
    } catch (error) {
      throw new AppError("Código de barras já existe");
    }
  }
}

export { CreateBarcodeController };
