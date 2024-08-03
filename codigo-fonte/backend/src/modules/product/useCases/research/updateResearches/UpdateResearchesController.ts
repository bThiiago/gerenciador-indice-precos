import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { UpdateResearchesUseCase } from "./UpdateResearchesUseCase";

class UpdateResearchesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { market, product, price } = request.body;

    const updateResearchesUseCase = container.resolve(UpdateResearchesUseCase);

    try {
      await updateResearchesUseCase.execute(id, { market, product, price });
      return response.send();
    } catch (error) {
      throw new AppError("Pesquisa não existe ou não pode ser editada");
    }
  }
}
export { UpdateResearchesController };
