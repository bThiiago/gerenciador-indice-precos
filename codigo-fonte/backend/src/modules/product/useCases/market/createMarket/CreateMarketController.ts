import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { CreateMarketUseCase } from "./CreateMarketUseCase";

class CreateMarketController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, city } = request.body;

    const createMarketUseCase = container.resolve(CreateMarketUseCase);

    try {
      await createMarketUseCase.execute({ name, city });
      return response.send();
    } catch (error) {
      throw new AppError("Mercado já existe");
    }
  }
}

export { CreateMarketController };
