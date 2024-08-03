import { inject, injectable } from "tsyringe";

import { IResearchesRepository } from "../../../repositories/IResearchesRepository";

@injectable()
class IndexProductsUseCase {
  constructor(
    @inject("ResearchesRepository")
    private researchesRepository: IResearchesRepository,
  ) {}

  async execute(year: number, category: string, city?: string): Promise<any[]> {
    const researches =
      await this.researchesRepository.meanProductIndexByCategory(
        year,
        category,
        city,
      );

    return researches;
  }
}

export { IndexProductsUseCase };
