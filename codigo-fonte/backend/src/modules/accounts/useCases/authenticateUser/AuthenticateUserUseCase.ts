import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../errors/AppError";
import { IUsersRepository } from "../../repositories/IUsersRepository";

require("dotenv").config();

interface IRequest {
  name: string;
  password: string;
}

interface IResponse {
  token: string;
  user: {
    name: string;
    level: number;
  };
}
@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ name, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByName(name);

    if (!user) {
      throw new AppError("Nome ou senha invalidos!");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Nome ou senha invalidos!");
    }
    // md5 hash
    const token = sign({}, process.env.JWT, {
      subject: user.id,
      expiresIn: "1d",
    });

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        level: user.level,
      },
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase };
