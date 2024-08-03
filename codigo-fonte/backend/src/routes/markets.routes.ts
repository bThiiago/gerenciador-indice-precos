import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { AuthenticateUserController } from "../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { CreateMarketController } from "../modules/product/useCases/market/createMarket/CreateMarketController";
import { DeleteMarketController } from "../modules/product/useCases/market/deleteMarket/DeleteMarketsController";
import { FindMarketsController } from "../modules/product/useCases/market/findMarket/FindMarketsController";
import { ListMarketsConroller } from "../modules/product/useCases/market/listMarkets/ListMarketsController";
import { UpdateMarketController } from "../modules/product/useCases/market/updateMarket/UpdateMarketController";

const marketsRoutes = Router();

const createMarketController = new CreateMarketController();
const listMarketController = new ListMarketsConroller();
const deleteMarketController = new DeleteMarketController();
const findMarketsController = new FindMarketsController();
const updateMarketController = new UpdateMarketController();
const authenticateUserController = new AuthenticateUserController();

// marketsRoutes.post("/sessions", authenticateUserController.handle);
// marketsRoutes.use(ensureAuthenticated);
marketsRoutes.post("/", createMarketController.handle);
marketsRoutes.get("/", listMarketController.handle);
marketsRoutes.delete("/:id", deleteMarketController.handle);
marketsRoutes.get("/:name", findMarketsController.handle);
marketsRoutes.get("/id/:id", findMarketsController.handleById);
marketsRoutes.put("/:id", updateMarketController.handle);

export { marketsRoutes };
