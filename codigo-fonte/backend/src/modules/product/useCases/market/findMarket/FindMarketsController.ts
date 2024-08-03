import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { FindMarketsUseCase } from "./FindMarketsUseCase";

class FindMarketsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.params;

    const findMarketsUseCase = container.resolve(FindMarketsUseCase);

    try {
      const market = await findMarketsUseCase.execute(name);

      if (!market) {
        return response.status(404).json({ message: "Mercado não encontrado" });
      }
      return response.json(market);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Erro do servidor interno" });
    }
  }

  async handleById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findMarketsUseCase = container.resolve(FindMarketsUseCase);

    const market = await findMarketsUseCase.executeById(id);

    if (!market) {
      throw new AppError("Mercado não encontrado");
    }

    return response.json(market);
  }
}

export { FindMarketsController };
