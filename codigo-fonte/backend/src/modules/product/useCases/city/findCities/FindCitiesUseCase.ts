import { inject, injectable } from "tsyringe";

import { City } from "../../../entities/City";
import { ICitiesRepository } from "../../../repositories/ICitiesRepository";

@injectable()
class FindCitiesUseCase {
  constructor(
    @inject("CitiesRepository")
    private CitiesRepository: ICitiesRepository,
  ) {}

  async execute(name: string): Promise<City[] | null> {
    const city = await this.CitiesRepository.find(name);

    return city;
  }

  async executeById(id: string): Promise<City | undefined> {
    const city = await this.CitiesRepository.findById(id);

    return city;
  }
}

export { FindCitiesUseCase };
