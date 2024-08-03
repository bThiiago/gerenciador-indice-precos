import { ILike, Repository, getRepository } from "typeorm";

import { ICreateUserDTO } from "../../dtos/ICreateUsersDTO";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({ name, password, level }: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      name,
      password,
      level,
    });

    await this.repository.save(user);
  }

  async delete(id: string): Promise<void> {
    const users = await this.repository.findOne({ id });

    await this.repository.delete(users);
  }

  async list(): Promise<User[]> {
    const users = await this.repository.find();

    return users;
  }

  async update(id: string, data: ICreateUserDTO): Promise<void> {
    const user = await this.repository.findOne(id);

    if (!user) {
      throw new Error("Usuario não encontrado");
    }

    user.name = data.name;
    user.level = data.level;
    user.password = data.password;

    await this.repository.save(user);
  }

  async find(name: string): Promise<User[]> {
    const users = await this.repository.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });

    return users;
  }

  async findByName(name: string): Promise<User> {
    const user = await this.repository.findOne({
      where: {
        name: ILike(`${name}`),
      },
    });

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne(id);
    return user;
  }
}

export { UsersRepository };
