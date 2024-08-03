import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { ICitiesRepository } from "../../../repositories/ICitiesRepository";

interface IRequest {
  name: string;
  state: string;
}

@injectable()
class UpdateCityUseCase {
  constructor(
    @inject("CitiesRepository")
    private citiesRepository: ICitiesRepository,
  ) {}

  async execute(id: string, { name, state }: IRequest): Promise<void> {
    const city = await this.citiesRepository.findById(id);

    if (!city) {
      throw new AppError("Cidade não encontrada");
    }

    if (name !== city.name) {
      const cityAlreadyExists = await this.citiesRepository.findByName(name);

      if (cityAlreadyExists && cityAlreadyExists.id !== city.id) {
        throw new AppError("Cidade já existe");
      }

      city.name = name;
    }

    city.state = state;

    await this.citiesRepository.update(id, {
      name: city.name,
      state: city.state,
    });
  }
}

export { UpdateCityUseCase };
