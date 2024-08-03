import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { FindResearchesUseCase } from "./FindResearchesUseCase";

class FindResearchesController {
  async handleById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findResearchesUseCase = container.resolve(FindResearchesUseCase);

    const research = await findResearchesUseCase.executeById(id);

    if (!research) {
      throw new AppError("Produto não encontrado");
    }

    return response.json(research);
  }
}

export { FindResearchesController };
