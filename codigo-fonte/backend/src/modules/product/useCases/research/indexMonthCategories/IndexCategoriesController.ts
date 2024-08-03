import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { IndexCategoriesUseCase } from "./IndexCategoriesUseCase";

class IndexCategoriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { year, category } = request.query;

    if (!year || !category) {
      throw new AppError("Year and category are required query parameters.");
    }

    const indexCategoriesUseCase = container.resolve(IndexCategoriesUseCase);

    try {
      const researches = await indexCategoriesUseCase.execute(
        parseInt(year as string, 10),
        category as string,
      );

      return response.json(researches);
    } catch (error) {
      throw new AppError("Internal Server Error");
    }
  }
}

export { IndexCategoriesController };
