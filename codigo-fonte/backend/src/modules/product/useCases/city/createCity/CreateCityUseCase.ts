import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { ICitiesRepository } from "../../../repositories/ICitiesRepository";

interface IRequest {
  name: string;
  state: string;
}

@injectable()
class CreateCityUseCase {
  constructor(
    @inject("CitiesRepository")
    private citiesRepository: ICitiesRepository,
  ) {}

  async execute({ state, name }: IRequest): Promise<void> {
    const cityAlreadyExists = await this.citiesRepository.findByName(name);

    if (cityAlreadyExists) {
      throw new AppError("Cidade já existe");
    }

    this.citiesRepository.create({ name, state });
  }
}

export { CreateCityUseCase };
