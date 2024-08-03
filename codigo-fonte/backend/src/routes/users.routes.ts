import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { AuthenticateUserController } from "../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { CreateUserController } from "../modules/accounts/useCases/createUser/CreateUserController";
import { DeleteUsersController } from "../modules/accounts/useCases/deleteUser/DeleteUsersController";
import { FindUserController } from "../modules/accounts/useCases/findUsers/FindUsersController";
import { ListUsersController } from "../modules/accounts/useCases/listUsers/ListUsersController";
import { UpdateUsersController } from "../modules/accounts/useCases/updateUsers/UpdateUsersController";

const usersRoutes = Router();

const createUserController = new CreateUserController();
const listUsersController = new ListUsersController();
const deleteUsersController = new DeleteUsersController();
const findUserController = new FindUserController();
const updateUserController = new UpdateUsersController();
const authenticateUserController = new AuthenticateUserController();

// usersRoutes.post("/sessions", authenticateUserController.handle);
// usersRoutes.use(ensureAuthenticated);
usersRoutes.post("/", createUserController.handle);
usersRoutes.get("/", listUsersController.handle);
usersRoutes.delete("/:id", deleteUsersController.handle);
usersRoutes.get("/:name", findUserController.handle);
usersRoutes.get("/id/:id", findUserController.handleById);
usersRoutes.put("/:id", updateUserController.handle);

export { usersRoutes };
