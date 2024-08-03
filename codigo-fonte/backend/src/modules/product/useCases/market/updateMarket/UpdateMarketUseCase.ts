import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { City } from "../../../entities/City";
import { IMarketsRepository } from "../../../repositories/IMarketsRepository";

interface IRequest {
  name: string;
  city: City;
}

@injectable()
class UpdateMarketUseCase {
  constructor(
    @inject("MarketsRepository")
    private marketsRepository: IMarketsRepository,
  ) {}

  async execute(id: string, { name, city }: IRequest): Promise<void> {
    const market = await this.marketsRepository.findById(id);

    if (!market) {
      throw new AppError("Mercado não encontrado");
    }

    if (name !== market.name) {
      const marketAlreadyExists = await this.marketsRepository.findByName(name);

      if (marketAlreadyExists && marketAlreadyExists.id !== market.id) {
        throw new AppError("Mercado já existe");
      }

      market.name = name;
      market.city = city;
    }

    await this.marketsRepository.update(id, {
      name: market.name,
      city: market.city,
    });
  }
}

export { UpdateMarketUseCase };
