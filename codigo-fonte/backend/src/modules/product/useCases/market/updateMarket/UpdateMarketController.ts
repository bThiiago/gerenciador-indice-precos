import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { UpdateMarketUseCase } from "./UpdateMarketUseCase";

class UpdateMarketController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, city } = request.body;

    const updateMarketUseCase = container.resolve(UpdateMarketUseCase);

    try {
      await updateMarketUseCase.execute(id, { name, city });
      return response.send();
    } catch (error) {
      throw new AppError("Mercado não existe ou não pode ser editado");
    }
  }
}

export { UpdateMarketController };
