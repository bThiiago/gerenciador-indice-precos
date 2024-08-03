import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListResearchesUseCase } from "./ListResearchesUseCase";

class ListResearchesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { page, perPage } = request.query;

    const listResearchUseCase = container.resolve(ListResearchesUseCase);

    const all = await listResearchUseCase.execute(
      Number(page),
      Number(perPage),
    );

    return response.json(all);
  }
}
export { ListResearchesController };
