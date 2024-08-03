import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { UpdateProductUseCase } from "./UpdateProductUseCase";

class UpdateProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, category } = request.body;

    const updateProductUseCase = container.resolve(UpdateProductUseCase);

    try {
      await updateProductUseCase.execute(id, {
        name,
        category,
      });
      return response.send();
    } catch (error) {
      throw new AppError("Product does not exist or could not be updated");
    }
  }
}

export { UpdateProductController };
