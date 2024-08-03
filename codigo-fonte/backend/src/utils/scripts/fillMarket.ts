import { Market } from "../../modules/product/entities/Market";
import { CitiesRepository } from "../../modules/product/repositories/implementations/CitiesRepository";
import { FindCitiesUseCase } from "../../modules/product/useCases/city/findCities/FindCitiesUseCase";

async function seedDatabase() {
  try {
    const citiesRepository = new CitiesRepository();
    const findCities = new FindCitiesUseCase(citiesRepository);

    const Presidente_Epitácio = await findCities.execute("Presidente Epitácio");

    const ListMarket = [
      new Market("Avenida", Presidente_Epitácio[0]),
      new Market("Central", Presidente_Epitácio[0]),
      new Market("Neto", Presidente_Epitácio[0]),
    ];

    return ListMarket;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default seedDatabase;
