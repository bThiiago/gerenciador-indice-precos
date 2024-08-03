import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../../errors/AppError";
import { IResearchesRepository } from "../../../repositories/IResearchesRepository";

@injectable()
class DeleteResearchUseCase {
  constructor(
    @inject("ResearchesRepository")
    private researchRepository: IResearchesRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const research = await this.researchRepository.findById(id);

    if (!research) {
      throw new AppError("Pesquisa não encontrada");
    }
    await this.researchRepository.delete(id);
  }
}

export { DeleteResearchUseCase };
