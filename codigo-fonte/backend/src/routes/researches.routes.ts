import { Router } from "express";

import { CreateResearchController } from "../modules/product/useCases/research/createResearch/CreateResearchController";
import { DeleteResearchesController } from "../modules/product/useCases/research/deleteResearches/DeleteResearchesController";
import { FindByDataController } from "../modules/product/useCases/research/findByData/FindByDataController";
import { FindByDataToExcelController } from "../modules/product/useCases/research/findByData/FindByDataToExcelController";
import { FindResearchesController } from "../modules/product/useCases/research/findResearches/FindResearchesController";
import { IndexByCityController } from "../modules/product/useCases/research/indexByCity/IndexByCityController";
import { IndexCategoriesController } from "../modules/product/useCases/research/indexMonthCategories/IndexCategoriesController";
import { IndexProductsController } from "../modules/product/useCases/research/indexMonthProducts/IndexProductsController";
import { IndexController } from "../modules/product/useCases/research/indexResearch/IndexController";
import { ListResearchesController } from "../modules/product/useCases/research/listResearches/ListResearchesController";
import { UpdateResearchesController } from "../modules/product/useCases/research/updateResearches/UpdateResearchesController";

const researchesRoutes = Router();

const createResearchController = new CreateResearchController();
const listResearchesController = new ListResearchesController();
const deleteResearchesController = new DeleteResearchesController();
const findResearchesController = new FindResearchesController();
const updateResearchController = new UpdateResearchesController();
const indexCategoriesController = new IndexCategoriesController();
const indexProductsController = new IndexProductsController();
const indexController = new IndexController();
const indexByCityController = new IndexByCityController();
const findByDataController = new FindByDataController();
const findByDataToExcelController = new FindByDataToExcelController();

researchesRoutes.post("/", createResearchController.handle);
researchesRoutes.get("/", listResearchesController.handle);
researchesRoutes.get("/id/:id", findResearchesController.handleById);
researchesRoutes.delete("/:id", deleteResearchesController.handle);
researchesRoutes.put("/:id", updateResearchController.handle);
researchesRoutes.get("/index/month", indexCategoriesController.handle);
researchesRoutes.get("/index/product", indexProductsController.handle);
researchesRoutes.get("/index", indexController.handle);
researchesRoutes.get("/index/city", indexByCityController.handle);

// findByData
researchesRoutes.get("/data/:data", findByDataController.handleByData);
researchesRoutes.get(
  "/data-excel/:data",
  findByDataToExcelController.handleByData,
);

export { researchesRoutes };
