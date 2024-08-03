import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { City } from "../../../entities/City";
import { IMarketsRepository } from "../../../repositories/IMarketsRepository";

interface IRequest {
  name: string;
  city: City;
}

@injectable()
class CreateMarketUseCase {
  constructor(
    @inject("MarketsRepository")
    private marketRepository: IMarketsRepository,
  ) {}

  async execute({ name, city }: IRequest): Promise<void> {
    const marketAlreadyExists = await this.marketRepository.findByName(name);

    if (marketAlreadyExists) {
      throw new AppError("Mercado já existe");
    }

    this.marketRepository.create({ name, city });
  }
}

export { CreateMarketUseCase };
