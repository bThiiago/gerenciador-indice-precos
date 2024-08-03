import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { IndexUseCase } from "./IndexUseCase";

class IndexController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { year } = request.query;

    if (!year) {
      throw new AppError("Year are required query parameters.");
    }

    const indexUseCase = container.resolve(IndexUseCase);

    try {
      const researches = await indexUseCase.execute(
        parseInt(year as string, 10),
      );

      return response.json(researches);
    } catch (error) {
      throw new AppError("Internal Server Error");
    }
  }
}

export { IndexController };
