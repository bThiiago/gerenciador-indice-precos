import { container } from "tsyringe";

import { UsersRepository } from "../../modules/accounts/repositories/implementations/UsersRepository";
import { IUsersRepository } from "../../modules/accounts/repositories/IUsersRepository";
import { IBarcodesRepository } from "../../modules/product/repositories/IBarcodesRepository";
import { ICategoriesRepository } from "../../modules/product/repositories/ICategoriesRepository";
import { IMarketsRepository } from "../../modules/product/repositories/IMarketsRepository";
import { BarcodeRepository } from "../../modules/product/repositories/implementations/BarcodesRepository";
import { CategoriesRepository } from "../../modules/product/repositories/implementations/CategoriesRepository";
import { MarketsRepository } from "../../modules/product/repositories/implementations/MarketsRepository";
import { ProductsRepository } from "../../modules/product/repositories/implementations/ProductsRepository";
import { ResearchesRepository } from "../../modules/product/repositories/implementations/ResearchesRepository";
import { IProductsRepository } from "../../modules/product/repositories/IProductsRepository";
import { IResearchesRepository } from "../../modules/product/repositories/IResearchesRepository";
import { ICitiesRepository } from "../../modules/product/repositories/ICitiesRepository";
import { CitiesRepository } from "../../modules/product/repositories/implementations/CitiesRepository";

container.registerSingleton<ICategoriesRepository>(
  "CategoriesRepository",
  CategoriesRepository,
);

container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  UsersRepository,
);

container.registerSingleton<ICitiesRepository>(
  "CitiesRepository",
  CitiesRepository,
);

container.registerSingleton<IMarketsRepository>(
  "MarketsRepository",
  MarketsRepository,
);

container.registerSingleton<IProductsRepository>(
  "ProductsRepository",
  ProductsRepository,
);

container.registerSingleton<IResearchesRepository>(
  "ResearchesRepository",
  ResearchesRepository,
);

container.registerSingleton<IBarcodesRepository>(
  "BarcodesRepository",
  BarcodeRepository,
);
