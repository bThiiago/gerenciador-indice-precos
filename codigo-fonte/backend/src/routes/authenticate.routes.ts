import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { AuthenticateUserController } from "../modules/accounts/useCases/authenticateUser/AuthenticateUserController";

const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();

authenticateRoutes.post("/sessions", authenticateUserController.handle);

authenticateRoutes.use(ensureAuthenticated);
authenticateRoutes.get(
  "/sessions/validate",
  authenticateUserController.validate,
);

export { authenticateRoutes };
