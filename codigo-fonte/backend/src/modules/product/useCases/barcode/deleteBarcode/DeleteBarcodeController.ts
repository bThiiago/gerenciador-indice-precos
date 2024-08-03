import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { DeleteBarcodeUseCase } from "./DeleteBarcodeUseCase";

class DeleteBarcodeController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    try {
      const deleteBarcodeUseCase = container.resolve(DeleteBarcodeUseCase);
      await deleteBarcodeUseCase.execute(id);
      return response.send();
    } catch (error) {
      console.log(error);
      if (error.name === "QueryFailedError") {
        throw new AppError(
          "A código de barras não pode ser excluído porque contém produtos relacionados",
        );
      }
      throw new AppError("Código de barras não encontrado");
    }
  }
}

export { DeleteBarcodeController };
