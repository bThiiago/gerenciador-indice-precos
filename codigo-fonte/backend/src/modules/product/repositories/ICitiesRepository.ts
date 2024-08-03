import { City } from "../entities/City";

interface ICreateCityDTO {
  name: string;
  state: string;
}

interface ICitiesRepository {
  create({ name, state }: ICreateCityDTO): Promise<void>;
  delete(id: string): Promise<void>;
  list(): Promise<City[]>;
  update(id: string, data: ICreateCityDTO): Promise<void>;
  find(name: string): Promise<City[]>;
  findByName(name: string): Promise<City>;
  findById(id: string): Promise<City | undefined>;
}

export { ICitiesRepository, ICreateCityDTO };
