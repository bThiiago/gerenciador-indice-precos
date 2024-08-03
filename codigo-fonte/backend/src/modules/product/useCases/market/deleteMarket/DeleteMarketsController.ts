import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { DeleteMarketsUseCase } from "./DeleteMarketsUseCase";

class DeleteMarketController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteMarketsUseCase = container.resolve(DeleteMarketsUseCase);

    try {
      await deleteMarketsUseCase.execute(id);
      return response.send();
    } catch (error) {
      if (error.name === "QueryFailedError") {
        throw new AppError(
          "O mercado não pode ser excluído porque possui pesquisas relacionadas",
        );
      }
      throw new AppError("Mercado não encontrado");
    }
  }
}

export { DeleteMarketController };
