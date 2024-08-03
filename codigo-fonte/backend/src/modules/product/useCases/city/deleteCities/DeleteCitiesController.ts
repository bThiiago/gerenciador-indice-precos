import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { DeleteCitiesUseCase } from "./DeleteCitiesUseCase";

class DeleteCitiesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteCitiesUseCase = container.resolve(DeleteCitiesUseCase);

    try {
      await deleteCitiesUseCase.execute(id);
      return response.send();
    } catch (error) {
      if (error.name === "QueryFailedError") {
        throw new AppError(
          "A cidade não pode ser excluída porque contém produtos relacionados",
        );
      }
      throw new AppError("Cidade não encontrada");
    }
  }
}

export { DeleteCitiesController };
