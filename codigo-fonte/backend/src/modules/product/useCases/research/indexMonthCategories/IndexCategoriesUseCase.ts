import { inject, injectable } from "tsyringe";

import { IResearchesRepository } from "../../../repositories/IResearchesRepository";

@injectable()
class IndexCategoriesUseCase {
  constructor(
    @inject("ResearchesRepository")
    private researchesRepository: IResearchesRepository,
  ) {}

  async execute(year: number, category: string): Promise<any[]> {
    const researches = await this.researchesRepository.meanMonthIndexByCategory(
      year,
      category,
    );

    return researches;
  }
}

export { IndexCategoriesUseCase };
