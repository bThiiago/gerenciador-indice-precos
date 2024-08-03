import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListMarketsUseCase } from "./ListMarketsUseCase";

class ListMarketsConroller {
  async handle(request: Request, response: Response): Promise<Response> {
    const { city } = request.query;

    const listMarketsUseCase = container.resolve(ListMarketsUseCase);

    const all = await listMarketsUseCase.execute(String(city));

    return response.json(all);
  }
}
export { ListMarketsConroller };
