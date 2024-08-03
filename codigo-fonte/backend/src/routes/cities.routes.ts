import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { AuthenticateUserController } from "../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { CreateCityController } from "../modules/product/useCases/city/createCity/CreateCityController";
import { DeleteCitiesController } from "../modules/product/useCases/city/deleteCities/DeleteCitiesController";
import { FindCitiesController } from "../modules/product/useCases/city/findCities/FindCitiesController";
import { ListCitiesController } from "../modules/product/useCases/city/listCities/ListCitiesController";
import { UpdateCityController } from "../modules/product/useCases/city/updateCity/UpdateCityController";

const citiesRoutes = Router();

const createCityController = new CreateCityController();
const listCitiesController = new ListCitiesController();
const deleteCitiesController = new DeleteCitiesController();
const findCitiesController = new FindCitiesController();
const updateCityController = new UpdateCityController();
const authenticateUserController = new AuthenticateUserController();

citiesRoutes.post("/", createCityController.handle);
citiesRoutes.get("/", listCitiesController.handle);
citiesRoutes.delete("/:id", deleteCitiesController.handle);
citiesRoutes.get("/:name", findCitiesController.handle);
citiesRoutes.get("/id/:id", findCitiesController.handleById);
citiesRoutes.put("/:id", updateCityController.handle);

export { citiesRoutes };
