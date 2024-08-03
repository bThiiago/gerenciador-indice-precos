import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListProductsUseCase } from "./ListProductsUseCase";

class ListProductsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { page, perPage, category } = request.query;

    const listsProductsUseCase = container.resolve(ListProductsUseCase);

    const all = await listsProductsUseCase.execute(
      Number(page),
      Number(perPage),
      String(category),
    );

    return response.json(all);
  }
}

export { ListProductsController };
