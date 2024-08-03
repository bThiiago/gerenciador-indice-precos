import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { CreateCityUseCase } from "./CreateCityUseCase";

class CreateCityController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, state } = request.body;

    const createCityUseCase = container.resolve(CreateCityUseCase);

    try {
      await createCityUseCase.execute({ name, state });
      return response.send();
    } catch (error) {
      throw new AppError("Cidade já existe");
    }
  }
}

export { CreateCityController };
