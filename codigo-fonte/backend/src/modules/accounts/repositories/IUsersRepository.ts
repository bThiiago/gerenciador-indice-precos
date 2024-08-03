import { ICreateUserDTO } from "../dtos/ICreateUsersDTO";
import { User } from "../entities/User";

interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<void>;
  delete(id: string): Promise<void>;
  update(id: string, data: ICreateUserDTO): Promise<void>;
  list(): Promise<User[]>;
  findByName(name: string): Promise<User>;
  findById(id: string): Promise<User>;
  find(name: string): Promise<User[]>;
}

export { IUsersRepository };
