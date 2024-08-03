import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { IMarketsRepository } from "../../../repositories/IMarketsRepository";

@injectable()
class DeleteMarketsUseCase {
  constructor(
    @inject("MarketsRepository")
    private marketRepository: IMarketsRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const market = await this.marketRepository.findById(id);

    if (!market) {
      throw new AppError("Mercado não encontrado");
    }

    await this.marketRepository.delete(id);
  }
}

export { DeleteMarketsUseCase };
