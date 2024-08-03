import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { IndexProductsUseCase } from "./IndexProductsUseCase";

class IndexProductsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { year, category, city } = request.query;

    if (!year || !category) {
      throw new AppError("Year and category are required query parameters.");
    }

    const indexProductsUseCase = container.resolve(IndexProductsUseCase);

    try {
      const researches = await indexProductsUseCase.execute(
        parseInt(year as string, 10),
        category as string,
        city as string,
      );

      return response.json(researches);
    } catch (error) {
      throw new AppError("Internal Server Error");
    }
  }
}

export { IndexProductsController };
