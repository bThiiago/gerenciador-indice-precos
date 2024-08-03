import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../errors/AppError";
import { UpdateUserUseCase } from "./UpdateUsersUseCase";

class UpdateUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, password, level } = request.body;

    const updateUserUseCase = container.resolve(UpdateUserUseCase);

    try {
      await updateUserUseCase.execute(id, { name, password, level });
      return response.send();
    } catch (error) {
      throw new AppError("Usuario não existe ou não pode ser editado");
    }
  }
}

export { UpdateUsersController };
