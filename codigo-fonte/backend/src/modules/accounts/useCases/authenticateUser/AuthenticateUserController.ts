import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, password } = request.body;

    const authentcateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const token = await authentcateUserUseCase.execute({
      password,
      name,
    });

    return response.json(token);
  }

  async validate(request: Request, response: Response): Promise<Response> {
    const { token } = request.body;

    return response.json(token);
  }
}

export { AuthenticateUserController };
