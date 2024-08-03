import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { FindCitiesUseCase } from "./FindCitiesUseCase";

class FindCitiesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.params;

    const findCitiesUseCase = container.resolve(FindCitiesUseCase);

    const city = await findCitiesUseCase.execute(name);

    if (!city) {
      throw new AppError("Cidade não encontrada");
    }

    return response.json(city);
  }

  async handleById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findCitiesUseCase = container.resolve(FindCitiesUseCase);

    const city = await findCitiesUseCase.executeById(id);

    if (!city) {
      throw new AppError("Cidade não encontrada");
    }

    return response.json(city);
  }
}

export { FindCitiesController };
