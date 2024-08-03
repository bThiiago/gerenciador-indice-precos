import { inject, injectable } from "tsyringe";

import { Market } from "../../../entities/Market";
import { IMarketsRepository } from "../../../repositories/IMarketsRepository";

@injectable()
class FindMarketsUseCase {
  constructor(
    @inject("MarketsRepository")
    private marketsRepository: IMarketsRepository,
  ) {}

  async execute(name: string): Promise<Market[] | null> {
    const market = await this.marketsRepository.find(name);

    return market;
  }

  async executeById(id: string): Promise<Market | undefined> {
    const market = await this.marketsRepository.findById(id);

    return market;
  }
}

export { FindMarketsUseCase };
