import { inject, injectable } from "tsyringe";

import { Market } from "../../../entities/Market";
import { IMarketsRepository } from "../../../repositories/IMarketsRepository";

@injectable()
class ListMarketsUseCase {
  constructor(
    @inject("MarketsRepository")
    private marketsRepository: IMarketsRepository,
  ) {}

  async execute(city?: string): Promise<Market[]> {
    const markets = await this.marketsRepository.list(city);

    return markets;
  }
}

export { ListMarketsUseCase };
