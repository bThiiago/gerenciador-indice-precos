import { Barcode } from "../../modules/product/entities/Barcode";
import { ProductsRepository } from "../../modules/product/repositories/implementations/ProductsRepository";
import { FindProductsUseCase } from "../../modules/product/useCases/product/findProducts/FindProductsUseCase";

async function seedDatabase() {
  try {
    const productsRepository = new ProductsRepository();

    const findProduct = new FindProductsUseCase(productsRepository);

    const aguaSanitaria = await findProduct.execute("Água Sanitária");
    const amaciante = await findProduct.execute("Amaciante");
    const desinfetante = await findProduct.execute("Desinfetante");
    const detergente = await findProduct.execute("Detergente");
    const esponja = await findProduct.execute("Esponja");

    const ListBarcode = [
      new Barcode("7894900681017", aguaSanitaria[0]),
      new Barcode("7892840800079", amaciante[0]),
      new Barcode("7896718701086", desinfetante[0]),
      new Barcode("7894900011159", detergente[0]),
      new Barcode("7894900010015", esponja[0]),
    ];

    return ListBarcode;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default seedDatabase;
