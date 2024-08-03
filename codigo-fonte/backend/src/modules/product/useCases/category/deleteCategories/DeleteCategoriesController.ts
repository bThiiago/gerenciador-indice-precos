import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { DeleteCategoriesUseCase } from "./DeleteCategoriesUseCase";

class DeleteCategoriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteCategoriesUseCase = container.resolve(DeleteCategoriesUseCase);

    try {
      await deleteCategoriesUseCase.execute(id);
      return response.send();
    } catch (error) {
      if (error.name === "QueryFailedError") {
        throw new AppError(
          "A categoria não pode ser excluída porque contém produtos relacionados",
        );
      }
      throw new AppError("Categoria não encontrada");
    }
  }
}

export { DeleteCategoriesController };
