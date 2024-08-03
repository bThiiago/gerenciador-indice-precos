import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

class CreateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, barcode, color } = request.body;

    const createCategoryUseCase = container.resolve(CreateCategoryUseCase);

    try {
      await createCategoryUseCase.execute({ name, barcode, color });
      return response.send();
    } catch (error) {
      throw new AppError("Categoria já existe");
    }
  }
}

export { CreateCategoryController };
