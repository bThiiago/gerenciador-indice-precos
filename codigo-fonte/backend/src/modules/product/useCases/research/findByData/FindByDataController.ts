import { Request, Response } from "express";
import { container } from "tsyringe";

import { FindByDataUseCase } from "./FindByDataUseCase";

class FindByDataController {
  async handleByData(request: Request, response: Response): Promise<Response> {
    const { data } = request.params;

    const findResearchesUseCase = container.resolve(FindByDataUseCase);

    const researchs = await findResearchesUseCase.executeByData(data);

    return response.json(researchs);
  }
}

export { FindByDataController };
