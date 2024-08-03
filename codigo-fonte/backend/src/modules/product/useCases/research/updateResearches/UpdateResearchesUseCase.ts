import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { Market } from "../../../entities/Market";
import { Product } from "../../../entities/Product";
import { IResearchesRepository } from "../../../repositories/IResearchesRepository";

interface IRequest {
  market: Market;
  price: number;
  product: Product;
}

@injectable()
class UpdateResearchesUseCase {
  constructor(
    @inject("ResearchesRepository")
    private researchRepository: IResearchesRepository,
  ) {}

  async execute(
    id: string,
    { market, price, product }: IRequest,
  ): Promise<void> {
    const research = await this.researchRepository.findById(id);

    if (!research) {
      throw new AppError("Pesquisa não encontrada");
    }

    research.market = market;
    research.price = price;
    research.product = product;

    await this.researchRepository.update(id, {
      market: research.market,
      price: research.price,
      product: research.product,
    });
  }
}

export { UpdateResearchesUseCase };
