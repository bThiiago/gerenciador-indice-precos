import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateResearchUseCase } from "./CreateResearchUseCase";

class CreateResearchController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { market, product, price } = request.body;

    const createResearchUseCase = container.resolve(CreateResearchUseCase);

    await createResearchUseCase.execute({
      market,
      product,
      price,
    });

    return response.send();
  }
}

export { CreateResearchController };
