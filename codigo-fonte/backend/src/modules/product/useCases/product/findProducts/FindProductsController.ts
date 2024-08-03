import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { FindProductsUseCase } from "./FindProductsUseCase";

class FindProductsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.params;

    const findProductsUseCase = container.resolve(FindProductsUseCase);

    const product = await findProductsUseCase.execute(name);

    if (!product) {
      throw new AppError("Produto não encontrado");
    }

    return response.json(product);
  }

  async handleById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findProductsUseCase = container.resolve(FindProductsUseCase);

    const product = await findProductsUseCase.executeById(id);

    if (!product) {
      throw new AppError("Produto não encontrado");
    }

    return response.json(product);
  }
}

export { FindProductsController };
