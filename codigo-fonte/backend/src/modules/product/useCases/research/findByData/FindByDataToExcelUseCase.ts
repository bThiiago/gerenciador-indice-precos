import { inject, injectable } from "tsyringe";

import { Research } from "../../../entities/Research";
import { IResearchesRepository } from "../../../repositories/IResearchesRepository";

@injectable()
class FindByDataToExcelUseCase {
  constructor(
    @inject("ResearchesRepository")
    private ResearchesRepository: IResearchesRepository,
  ) {}

  async executeByDataToExcel(data: string): Promise<Research[]> {
    const researchs = await this.ResearchesRepository.findByDataToExcel(data);

    return researchs;
  }
}

export { FindByDataToExcelUseCase };
