import { Category } from "../entities/Category";
import { Product } from "../entities/Product";

interface ICreateProductDTO {
  name: string;
  category: Category;
  created_at?: Date;
}

interface IUpdateProductDTO {
  name: string;
  category: Category;
}

interface IProductsRepository {
  create({ name, category }: ICreateProductDTO): Promise<void>;
  delete(id: string): Promise<void>;
  list(page?: number, perPage?: number, category?: string): Promise<Product[]>;
  update(id: string, data: IUpdateProductDTO): Promise<void>;
  find(name: string): Promise<Product[]>;
  findByName(name: string): Promise<Product>;
  findById(id: string): Promise<Product | undefined>;
  findBarcode(barcode: string): Promise<Product>;
}

export { IProductsRepository, ICreateProductDTO };
