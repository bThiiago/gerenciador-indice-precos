import { inject, injectable } from "tsyringe";

import { City } from "../../../entities/City";
import { ICitiesRepository } from "../../../repositories/ICitiesRepository";

@injectable()
class ListCitiesUseCase {
  constructor(
    @inject("CitiesRepository")
    private citiesRepository: ICitiesRepository,
  ) {}

  async execute(): Promise<City[]> {
    const cities = await this.citiesRepository.list();

    return cities;
  }
}

export { ListCitiesUseCase };
