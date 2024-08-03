import "reflect-metadata";
import { container } from "tsyringe";
import { createConnection } from "typeorm";

import { UsersRepository } from "../../modules/accounts/repositories/implementations/UsersRepository";
import { CreateUserUseCase } from "../../modules/accounts/useCases/createUser/CreateUserUseCase";
import { BarcodeRepository } from "../../modules/product/repositories/implementations/BarcodesRepository";
import { CategoriesRepository } from "../../modules/product/repositories/implementations/CategoriesRepository";
import { CitiesRepository } from "../../modules/product/repositories/implementations/CitiesRepository";
import { MarketsRepository } from "../../modules/product/repositories/implementations/MarketsRepository";
import { ProductsRepository } from "../../modules/product/repositories/implementations/ProductsRepository";
import { ResearchesRepository } from "../../modules/product/repositories/implementations/ResearchesRepository";
import { CreateBarcodeUseCase } from "../../modules/product/useCases/barcode/createBarcode/CreateBarcodeUseCase";
import { CreateCategoryUseCase } from "../../modules/product/useCases/category/createCategory/CreateCategoryUseCase";
import { CreateCityUseCase } from "../../modules/product/useCases/city/createCity/CreateCityUseCase";
import { CreateMarketUseCase } from "../../modules/product/useCases/market/createMarket/CreateMarketUseCase";
import ListBarcode from "./fillBarcode";
import ListCategory from "./fillCategory";
import ListCity from "./fillCity";
import ListMarket from "./fillMarket";
import ListProduct from "./fillProduct";
import ListResearch from "./fillResearch";
import ListUser from "./fillUser";

async function seedDatabase() {
  try {
    const connection = await createConnection();

    const usersRepository = new UsersRepository();
    const categoriesRepository = new CategoriesRepository();
    const citiesRepository = new CitiesRepository();
    const marketsRepository = new MarketsRepository();
    const barcodeRepository = new BarcodeRepository();

    const createUserCase = new CreateUserUseCase(usersRepository);
    const createCategoryCase = new CreateCategoryUseCase(categoriesRepository);
    const createCityCase = new CreateCityUseCase(citiesRepository);
    const createMarketCase = new CreateMarketUseCase(marketsRepository);
    const createBarcodeCase = new CreateBarcodeUseCase(barcodeRepository);

    await Promise.all(
      ListCity.map(async (city) => {
        try {
          await createCityCase.execute(city);
          console.log(`[SCRIPT BD] CIDADE - "${city.name}"`);
        } catch (error) {
          if (error.statusCode === 400) {
            console.log(
              `[SCRIPT BD] ERRO AO INSERIR CIDADE - "${city.name}": ${error.message}`,
            );
          } else {
            throw error;
          }
        }
      }),
    );

    await Promise.all(
      ListUser.map(async (user) => {
        try {
          await createUserCase.execute(user);
          console.log(`[SCRIPT BD] USUARIO - "${user.name}"`);
        } catch (error) {
          if (error.statusCode === 400) {
            console.log(
              `[SCRIPT BD] ERRO AO INSERIR USUARIO - "${user.name}": ${error.message}`,
            );
          } else {
            throw error;
          }
        }
      }),
    );

    await Promise.all(
      ListCategory.map(async (category) => {
        try {
          await createCategoryCase.execute(category);
          console.log(`[SCRIPT BD] CATEGORIA - "${category.name}"`);
        } catch (error) {
          if (error.statusCode === 400) {
            console.log(
              `[SCRIPT BD] ERRO AO INSERIR CATEGORIA - "${category.name}": ${error.message}`,
            );
          } else {
            throw error;
          }
        }
      }),
    );

    const marketArray = await ListMarket();
    const marketPromises = marketArray.map(async (market) => {
      try {
        await createMarketCase.execute(market);
        console.log(`[SCRIPT BD] MERCADO - "${market.name}"`);
      } catch (error) {
        if (error.statusCode === 400) {
          console.log(
            `[SCRIPT BD] ERRO AO INSERIR MERCADO - "${market.name}": ${error.message}`,
          );
        } else {
          throw error;
        }
      }
    });

    await Promise.all(marketPromises);

    const createProductCase = container.resolve(ProductsRepository);
    const productArray = await ListProduct();

    const productPromises = () => {
      return productArray.map((product) => {
        return new Promise<void>((resolve) => {
          console.log(`[SCRIPT BD] PRODUCT - "${product.name}"`);
          createProductCase.create(product).then(() => {
            resolve();
          });
        });
      });
    };
    await Promise.all(productPromises());

    const barcodeArray = await ListBarcode();
    const barcodePromises = barcodeArray.map(async (barcode) => {
      try {
        await createBarcodeCase.execute(barcode);
        console.log(`[SCRIPT BD] BARCODE - "${barcode.code}"`);
      } catch (error) {
        if (error.statusCode === 400) {
          console.log(
            `[SCRIPT BD] ERRO AO INSERIR BARCODE - "${barcode.code}": ${error.message}`,
          );
        } else {
          throw error;
        }
      }
    });
    await Promise.all(barcodePromises);

    const createResearchCase = container.resolve(ResearchesRepository);
    const researchArray = await ListResearch();

    const researchPromises = () => {
      return researchArray.map((research) => {
        return new Promise<void>((resolve) => {
          console.log(`[SCRIPT BD] RESEARCH - "${research.created_at}"`);
          createResearchCase.create(research).then(() => {
            resolve();
          });
        });
      });
    };
    await Promise.all(researchPromises());

    await connection.close();
    console.log("Dados inseridos com sucesso.");
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
  }
}

seedDatabase();
