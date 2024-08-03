import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { CreateProductUseCase } from "./CreateProductUseCase";

class CreateProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, category } = request.body;

    const createProductUseCase = container.resolve(CreateProductUseCase);

    try {
      await createProductUseCase.execute({ name, category });
      return response.send();
    } catch (error) {
      console.log(error);
      throw new AppError("Produto já existe");
    }
  }
}
export { CreateProductController };
