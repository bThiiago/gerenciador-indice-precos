import { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "../../../../errors/AppError";
import { FindUsersUseCase } from "./FindUsersUseCase";

class FindUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.params;

    const findUsersUseCase = container.resolve(FindUsersUseCase);

    const user = await findUsersUseCase.execute(name);

    if (!user) {
      throw new AppError("Usuario não encontrado");
    }

    return response.json(user);
  }

  async handleById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findUserUseCase = container.resolve(FindUsersUseCase);

    const User = await findUserUseCase.executeById(id);

    if (!User) {
      throw new AppError("Usuario não encontrado");
    }

    return response.json(User);
  }
}

export { FindUserController };
