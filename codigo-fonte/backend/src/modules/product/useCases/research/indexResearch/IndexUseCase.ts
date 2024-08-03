import { inject, injectable } from "tsyringe";

import { IResearchesRepository } from "../../../repositories/IResearchesRepository";

@injectable()
class IndexUseCase {
  constructor(
    @inject("ResearchesRepository")
    private researchesRepository: IResearchesRepository,
  ) {}

  async execute(year: number): Promise<any[]> {
    const researches = await this.researchesRepository.meanMonthIndex(year);

    return researches;
  }
}

export { IndexUseCase };
