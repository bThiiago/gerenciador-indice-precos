import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { ICitiesRepository } from "../../../repositories/ICitiesRepository";

@injectable()
class DeleteCitiesUseCase {
  constructor(
    @inject("CitiesRepository")
    private citiesRepository: ICitiesRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const city = await this.citiesRepository.findById(id);

    if (!city) {
      throw new AppError("Cidade não encontrada");
    }

    await this.citiesRepository.delete(id);
  }
}

export { DeleteCitiesUseCase };
