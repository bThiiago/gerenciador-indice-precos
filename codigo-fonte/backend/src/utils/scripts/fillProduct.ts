import { Product } from "../../modules/product/entities/Product";
import { CategoriesRepository } from "../../modules/product/repositories/implementations/CategoriesRepository";
import { FindCategoriesUseCase } from "../../modules/product/useCases/category/findCategories/FindCategoriesUseCase";

async function seedDatabase() {
  try {
    const categoriesRepository = new CategoriesRepository();
    const findCategories = new FindCategoriesUseCase(categoriesRepository);

    const [acougue] = await Promise.all([findCategories.execute("Açougue")]);
    const [feirinha] = await Promise.all([findCategories.execute("Feirinha")]);
    const [mercearia] = await Promise.all([
      findCategories.execute("Mercearia"),
    ]);
    const [limpeza] = await Promise.all([findCategories.execute("Limpeza")]);
    const [higiene] = await Promise.all([findCategories.execute("Higiene")]);

    const ListProduct = [
      new Product("Bisteca Suína (kg)", acougue[0]),
      new Product("Costela Minga (kg)", acougue[0]),
      new Product("Coxa e Sobrecoxa (kg)", acougue[0]),
      new Product("Coxão Duro (kg)", acougue[0]),
      new Product("Miolo de Paleta (kg)", acougue[0]),
      new Product("Pernil (kg)", acougue[0]),
      new Product("Banana (kg)", feirinha[0]),
      new Product("Alho (kg)", feirinha[0]),
      new Product("Batata (kg)", feirinha[0]),
      new Product("Cebola (kg)", feirinha[0]),
      new Product("Tomate (kg)", feirinha[0]),
      new Product("Ovo (dz)", feirinha[0]),
      new Product(
        "Achocolatado (370g)",

        mercearia[0],
      ),
      new Product(
        "Açúcar (kg)",

        mercearia[0],
      ),
      new Product(
        "Arroz (kg)",

        mercearia[0],
      ),
      new Product(
        "Bolacha água e sal",

        mercearia[0],
      ),
      new Product(
        "Bolacha maizena",

        mercearia[0],
      ),
      new Product(
        "Café (500g)",

        mercearia[0],
      ),
      new Product(
        "Farinha de mandioca (500g)",

        mercearia[0],
      ),
      new Product(
        "Farinha de trigo (kg)",

        mercearia[0],
      ),
      new Product(
        "Feijão (kg)",

        mercearia[0],
      ),
      new Product("Leite (l)", mercearia[0]),
      new Product(
        "Macarrão espaguete (500g)",

        mercearia[0],
      ),
      new Product(
        "Margarina (500g)",

        mercearia[0],
      ),
      new Product(
        "Milho (Lata)",

        mercearia[0],
      ),
      new Product(
        "Molho de tomate",

        mercearia[0],
      ),
      new Product(
        "Óleo (900ml)",

        mercearia[0],
      ),
      new Product("Sal (kg)", mercearia[0]),
      new Product("Sardinha", mercearia[0]),
      new Product(
        "Água Sanitária (l)",

        limpeza[0],
      ),
      new Product(
        "Amaciante (2l)",

        limpeza[0],
      ),
      new Product(
        "Desinfetante (2l)",

        limpeza[0],
      ),
      new Product("Detergente", limpeza[0]),
      new Product(
        "Esponja (4 unid.)",

        limpeza[0],
      ),
      new Product(
        "Palha de Aço",

        limpeza[0],
      ),
      new Product(
        "Sabão em barra (900g)",

        limpeza[0],
      ),
      new Product(
        "Sabão em pó (800g - 1kg)",

        limpeza[0],
      ),
      new Product(
        "Absorvente (8 unid. - noturno)",

        higiene[0],
      ),
      new Product(
        "Condicionador",

        higiene[0],
      ),
      new Product(
        "Desodorante roll-on (50ml)",

        higiene[0],
      ),
      new Product(
        "Papel Higiênico (4 unid. - 30m)",

        higiene[0],
      ),
      new Product(
        "Pasta de Dente (90g)",

        higiene[0],
      ),
      new Product(
        "Sabonete (85g)",

        higiene[0],
      ),
      new Product("Shampoo", higiene[0]),
    ];

    return ListProduct;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default seedDatabase;
