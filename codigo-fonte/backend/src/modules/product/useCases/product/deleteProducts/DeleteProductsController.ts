import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { DeleteProductsUseCase } from "./DeleteProductsUseCase";

class DeleteProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteProductsUseCase = container.resolve(DeleteProductsUseCase);

    try {
      await deleteProductsUseCase.execute(id);
      return response.json({ message: "Produto deletado" });
    } catch (error) {
      if (error.name === "QueryFailedError") {
        throw new AppError(
          "O produto não pode ser excluído porque possui pesquisas relacionadas",
        );
      }
      throw new AppError("Produto não encontrado");
    }
  }
}

export { DeleteProductController };
