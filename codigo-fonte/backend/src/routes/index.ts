import { Router } from "express";

import { authenticateRoutes } from "./authenticate.routes";
import { backupRoute } from "./backup.route";
import { barcodesRoutes } from "./barcodes.routes";
import { categoriesRoutes } from "./categories.routes";
import { citiesRoutes } from "./cities.routes";
import { marketsRoutes } from "./markets.routes";
import { productsRoutes } from "./products.routes";
import { researchesRoutes } from "./researches.routes";
import { usersRoutes } from "./users.routes";

const router = Router();

// paths geral para todas as rotas
router.use("/categories", categoriesRoutes);
router.use("/backup", backupRoute);
router.use("/cities", citiesRoutes);
router.use("/users", usersRoutes);
router.use("/markets", marketsRoutes);
router.use("/barcodes", barcodesRoutes);
router.use("/products", productsRoutes);
router.use("/researches", researchesRoutes);
router.use(authenticateRoutes);

export { router };
