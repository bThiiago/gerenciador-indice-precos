import { inject, injectable } from "tsyringe";

import { IResearchesRepository } from "../../../repositories/IResearchesRepository";

@injectable()
class IndexByCityUseCase {
  constructor(
    @inject("ResearchesRepository")
    private researchesRepository: IResearchesRepository,
  ) {}

  async execute(year: number, city?: string): Promise<any[]> {
    const researches = await this.researchesRepository.meanMonthByCity(
      year,
      city,
    );

    return researches;
  }
}

export { IndexByCityUseCase };
