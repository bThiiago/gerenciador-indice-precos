import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { AuthenticateUserController } from "../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { CreateBarcodeController } from "../modules/product/useCases/barcode/createBarcode/CreateBarcodeController";
import { DeleteBarcodeController } from "../modules/product/useCases/barcode/deleteBarcode/DeleteBarcodeController";
import { FindBarcodeController } from "../modules/product/useCases/barcode/findBarcode/FindBarcodeController";

const barcodesRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const createBarcodeController = new CreateBarcodeController();
const deleteBarcodeController = new DeleteBarcodeController();
const findBarcodeController = new FindBarcodeController();

barcodesRoutes.post("/", createBarcodeController.handle);
barcodesRoutes.delete("/:id", deleteBarcodeController.handle);
barcodesRoutes.get("/code/:code", findBarcodeController.handleByCode);
barcodesRoutes.get("/:id", findBarcodeController.handleById);
barcodesRoutes.get("/product/:product", findBarcodeController.handleByProduct);

export { barcodesRoutes };
