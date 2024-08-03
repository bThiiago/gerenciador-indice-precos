import { Request, Response } from "express";
import { container } from "tsyringe";

import { FindByDataToExcelUseCase } from "./FindByDataToExcelUseCase";

class FindByDataToExcelController {
  async handleByData(request: Request, response: Response): Promise<Buffer> {
    const { data } = request.params;

    const findResearchesUseCase = container.resolve(FindByDataToExcelUseCase);

    try {
      const excelBuffer =
        await findResearchesUseCase.executeByDataToExcel(data);

      response.setHeader(
        "Content-Disposition",
        `attachment; filename=relatorio_pesquisa_${data}.xlsx`,
      );
      response.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      response.send(excelBuffer);
    } catch (error) {
      console.error(error);
      response.status(500).send("Error generating Excel file");
    }
  }
}

export { FindByDataToExcelController };
