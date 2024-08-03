import { UUID } from "crypto";
import { ILike, Repository, getRepository } from "typeorm";

import { City } from "../../entities/City";
import { ICreateCityDTO, ICitiesRepository } from "../ICitiesRepository";

class CitiesRepository implements ICitiesRepository {
  private repository: Repository<City>;

  constructor() {
    this.repository = getRepository(City);
  }

  async create({ state, name }: ICreateCityDTO): Promise<void> {
    const city = this.repository.create({
      state,
      name,
    });
    await this.repository.save(city);
  }

  async update(id: string, data: ICreateCityDTO): Promise<void> {
    const city = await this.repository.findOne(id);

    if (!city) {
      throw new Error("Cidade não encontrada ");
    }

    city.name = data.name;
    city.state = data.state;

    await this.repository.save(city);
  }

  async delete(id: string): Promise<void> {
    const city = await this.repository.findOne({ id });

    await this.repository.delete(city);
  }

  async list(): Promise<City[]> {
    const cities = await this.repository.find({ order: { name: "ASC" } });

    return cities;
  }

  async find(name: string): Promise<City[]> {
    const city = await this.repository.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });

    return city;
  }

  async findByName(name: string): Promise<City> {
    const city = await this.repository.findOne({
      where: {
        name: ILike(`${name}`),
      },
    });
    return city;
  }

  async findById(id: UUID): Promise<City | undefined> {
    const city = await this.repository.findOne(id);

    return city;
  }
}

export { CitiesRepository };
