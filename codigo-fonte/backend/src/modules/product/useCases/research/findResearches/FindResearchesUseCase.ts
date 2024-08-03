import { inject, injectable } from "tsyringe";

import { Research } from "../../../entities/Research";
import { IResearchesRepository } from "../../../repositories/IResearchesRepository";

@injectable()
class FindResearchesUseCase {
  constructor(
    @inject("ResearchesRepository")
    private ResearchesRepository: IResearchesRepository,
  ) {}

  async executeById(id: string): Promise<Research | undefined> {
    const research = await this.ResearchesRepository.findById(id);

    return research;
  }
}

export { FindResearchesUseCase };
