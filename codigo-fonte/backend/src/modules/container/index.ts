import { container } from "tsyringe";

import { UsersRepository } from "../accounts/repositories/implementations/UsersRepository";
import { IUsersRepository } from "../accounts/repositories/IUsersRepository";
import { IBarcodesRepository } from "../product/repositories/IBarcodesRepository";
import { ICategoriesRepository } from "../product/repositories/ICategoriesRepository";
import { ICitiesRepository } from "../product/repositories/ICitiesRepository";
import { IMarketsRepository } from "../product/repositories/IMarketsRepository";
import { BarcodeRepository } from "../product/repositories/implementations/BarcodesRepository";
import { CategoriesRepository } from "../product/repositories/implementations/CategoriesRepository";
import { CitiesRepository } from "../product/repositories/implementations/CitiesRepository";
import { MarketsRepository } from "../product/repositories/implementations/MarketsRepository";

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

container.registerSingleton<IBarcodesRepository>(
  "BarcodesRepository",
  BarcodeRepository,
);
