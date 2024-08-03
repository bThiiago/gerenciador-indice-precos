import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { IndexByCityUseCase } from "./IndexByCityUseCase";

class IndexByCityController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { year, city } = request.query;

    if (!year) {
      throw new AppError("Year are required query parameters.");
    }

    const indexUseCase = container.resolve(IndexByCityUseCase);

    try {
      const researches = await indexUseCase.execute(
        parseInt(year as string, 10),
        city as string,
      );

      return response.json(researches);
    } catch (error) {
      throw new AppError("Internal Server Error");
    }
  }
}

export { IndexByCityController };
