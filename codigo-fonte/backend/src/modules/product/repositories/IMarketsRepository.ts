import { City } from "../entities/City";
import { Market } from "../entities/Market";

interface ICreateMarketDTO {
  name: string;
  city: City;
}

interface IMarketsRepository {
  create({ name, city }: ICreateMarketDTO): Promise<void>;
  delete(id: string): Promise<void>;
  list(city?: string): Promise<Market[]>;
  update(id: string, data: ICreateMarketDTO): Promise<void>;
  find(name: string): Promise<Market[]>;
  findByName(name: string): Promise<Market>;
  findById(id: string): Promise<Market | undefined>;
}

export { IMarketsRepository, ICreateMarketDTO };
