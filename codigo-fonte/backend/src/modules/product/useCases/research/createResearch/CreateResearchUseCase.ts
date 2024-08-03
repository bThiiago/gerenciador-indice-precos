import { inject, injectable } from "tsyringe";

import { Market } from "../../../entities/Market";
import { Product } from "../../../entities/Product";
import { IResearchesRepository } from "../../../repositories/IResearchesRepository";

interface IRequest {
  market: Market;
  product: Product;
  price: number;
}

@injectable()
class CreateResearchUseCase {
  constructor(
    @inject("ResearchesRepository")
    private researchRepository: IResearchesRepository,
  ) {}

  async execute({ market, product, price }: IRequest): Promise<void> {
    this.researchRepository.create({
      market,
      product,
      price,
    });
  }
}

export { CreateResearchUseCase };
