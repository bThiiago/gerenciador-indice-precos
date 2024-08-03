import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListUsersUseCase } from "./ListUsersUseCase";

class ListUsersController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listUserUseCase = container.resolve(ListUsersUseCase);

    const all = await listUserUseCase.execute();

    return response.json(all);
  }
}

export { ListUsersController };
