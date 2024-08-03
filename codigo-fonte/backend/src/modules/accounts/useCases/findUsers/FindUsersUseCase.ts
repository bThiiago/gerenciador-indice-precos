import { inject, injectable } from "tsyringe";

import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class FindUsersUseCase {
  constructor(
    @inject("UsersRepository")
    private UsersRepository: IUsersRepository,
  ) {}

  async execute(name: string): Promise<User[] | null> {
    const user = await this.UsersRepository.find(name);

    return user;
  }

  async executeById(id: string): Promise<User | undefined> {
    const user = await this.UsersRepository.findById(id);

    return user;
  }
}

export { FindUsersUseCase };
