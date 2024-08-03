import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { UpdateCityUseCase } from "./UpdateCityUseCase";

class UpdateCityController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, state } = request.body;

    const updateCityUseCase = container.resolve(UpdateCityUseCase);

    try {
      await updateCityUseCase.execute(id, { name, state });
      return response.send();
    } catch (error) {
      throw new AppError("Cidade não existe ou não pode ser editada");
    }
  }
}

export { UpdateCityController };
