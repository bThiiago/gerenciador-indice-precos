import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
  name: string;
  password: string;
  level: number;
}

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute(
    id: string,
    { name, password, level }: IRequest,
  ): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("Usuario não encontrado");
    }

    if (name !== user.name) {
      const userAlreadyExists = await this.usersRepository.findByName(name);

      if (userAlreadyExists && userAlreadyExists.id !== user.id) {
        throw new AppError("Usuario já existe");
      }
    }

    if (password) {
      const passwordHash = await hash(password, 8);
      user.password = passwordHash;
    }

    user.name = name;
    user.level = level;

    await this.usersRepository.update(id, user);
  }
}

export { UpdateUserUseCase };
