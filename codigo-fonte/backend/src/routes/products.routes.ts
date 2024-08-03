import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { AuthenticateUserController } from "../modules/accounts/useCases/authenticateUser/AuthenticateUserController";
import { CreateProductController } from "../modules/product/useCases/product/createProduct/CreateProductController";
import { DeleteProductController } from "../modules/product/useCases/product/deleteProducts/DeleteProductsController";
import { FindBarcodeController } from "../modules/product/useCases/product/findBarcode/FindBarcodeController";
import { FindProductsController } from "../modules/product/useCases/product/findProducts/FindProductsController";
import { ListProductsController } from "../modules/product/useCases/product/listProducts/ListProductsController";
import { UpdateProductController } from "../modules/product/useCases/product/updateProduct/UpdateProductController";

const productsRoutes = Router();

const createProductController = new CreateProductController();
const listsProductsController = new ListProductsController();
const deleteProductsController = new DeleteProductController();
const findProductsController = new FindProductsController();
const findBarcodeController = new FindBarcodeController();
const updateProductsController = new UpdateProductController();
const authenticateUserController = new AuthenticateUserController();

// productsRoutes.post("/sessions", authenticateUserController.handle);
// productsRoutes.use(ensureAuthenticated);
productsRoutes.post("/", createProductController.handle);
productsRoutes.get("/", listsProductsController.handle);
productsRoutes.delete("/:id", deleteProductsController.handle);
productsRoutes.get("/:name", findProductsController.handle);
productsRoutes.get("/barcode/:barcode", findBarcodeController.handle);
productsRoutes.get("/id/:id", findProductsController.handleById);
productsRoutes.put("/:id", updateProductsController.handle);

export { productsRoutes };
