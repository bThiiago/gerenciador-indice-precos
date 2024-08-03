import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../errors/AppError";
import { DeleteUsersUseCase } from "./DeleteUsersUseCase";

class DeleteUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteUsersUseCase = container.resolve(DeleteUsersUseCase);

    try {
      await deleteUsersUseCase.execute(id);
      return response.send();
    } catch (error) {
      throw new AppError("Usuario não encontrado");
    }
  }
}

export { DeleteUsersController };
