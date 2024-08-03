import { inject, injectable } from "tsyringe";

import { IResearchesRepository } from "../../../repositories/IResearchesRepository";

@injectable()
class FindByDataUseCase {
  constructor(
    @inject("ResearchesRepository")
    private ResearchesRepository: IResearchesRepository,
  ) {}

  async executeByData(data: string): Promise<Buffer> {
    const researchs = await this.ResearchesRepository.findByData(data);

    return researchs;
  }
}

export { FindByDataUseCase };
