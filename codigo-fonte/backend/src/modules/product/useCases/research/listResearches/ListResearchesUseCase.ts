import { inject, injectable } from "tsyringe";

import { Research } from "../../../entities/Research";
import { IResearchesRepository } from "../../../repositories/IResearchesRepository";

@injectable()
class ListResearchesUseCase {
  constructor(
    @inject("ResearchesRepository")
    private researchesRepository: IResearchesRepository,
  ) {}

  async execute(page: number, perPage: number): Promise<Research[]> {
    const researches = await this.researchesRepository.list(page, perPage);

    return researches;
  }
}

export { ListResearchesUseCase };
