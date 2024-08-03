import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { AuthenticateUserController } from "../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { CreateCategoryController } from "../modules/product/useCases/category/createCategory/CreateCategoryController";
import { DeleteCategoriesController } from "../modules/product/useCases/category/deleteCategories/DeleteCategoriesController";
import { FindCategoriesController } from "../modules/product/useCases/category/findCategories/FindCategoriesController";
import { ListCategoriesController } from "../modules/product/useCases/category/listCategories/ListCategoriesController";
import { UpdateCategoryController } from "../modules/product/useCases/category/updateCategory/UpdateCategoryController";

const categoriesRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();
const deleteCategoriesController = new DeleteCategoriesController();
const findCategoriesController = new FindCategoriesController();
const updateCategoryController = new UpdateCategoryController();

// categoriesRoutes.post("/sessions", authenticateUserController.handle);
// categoriesRoutes.use(ensureAuthenticated);
categoriesRoutes.post("/", createCategoryController.handle);
categoriesRoutes.get("/", listCategoriesController.handle);
categoriesRoutes.delete("/:id", deleteCategoriesController.handle);
categoriesRoutes.get("/:name", findCategoriesController.handle);
categoriesRoutes.get("/id/:id", findCategoriesController.handleById);
categoriesRoutes.put("/:id", updateCategoryController.handle);

export { categoriesRoutes };
