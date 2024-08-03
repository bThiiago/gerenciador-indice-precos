import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { UpdateCategoryUseCase } from "./UpdateCategoryUseCase";

class UpdateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, barcode, color } = request.body;

    const updateCategoryUseCase = container.resolve(UpdateCategoryUseCase);

    try {
      await updateCategoryUseCase.execute(id, { name, barcode, color });
      return response.send();
    } catch (error) {
      throw new AppError("Categoria não existe ou não pode ser editada");
    }
  }
}

export { UpdateCategoryController };
