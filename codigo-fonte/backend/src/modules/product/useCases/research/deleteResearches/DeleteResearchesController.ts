import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { DeleteResearchUseCase } from "./DeleteResearchesUseCase";

class DeleteResearchesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteResearchUseCase = container.resolve(DeleteResearchUseCase);

    try {
      await deleteResearchUseCase.execute(id);
      return response.send();
    } catch (error) {
      if (error.name === "QueryFailedError") {
        throw new AppError(
          "A pesquisa não pode ser deletada porque contém produtos ou mercados relacionados",
        );
      }
      throw new AppError("Pesquisa não encontrada");
    }
  }
}

export { DeleteResearchesController };
