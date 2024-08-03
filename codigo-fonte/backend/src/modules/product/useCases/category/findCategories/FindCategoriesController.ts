import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { FindCategoriesUseCase } from "./FindCategoriesUseCase";

class FindCategoriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.params;

    const findCategoriesUseCase = container.resolve(FindCategoriesUseCase);

    const category = await findCategoriesUseCase.execute(name);

    if (!category) {
      throw new AppError("Categoria não encontrada");
    }

    return response.json(category);
  }

  async handleById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findCategoriesUseCase = container.resolve(FindCategoriesUseCase);

    const category = await findCategoriesUseCase.executeById(id);

    if (!category) {
      throw new AppError("Categoria não encontrada");
    }

    return response.json(category);
  }
}

export { FindCategoriesController };
