import { Category } from "../entities/Category";

interface ICreateCategoryDTO {
  name: string;
  barcode: boolean;
  color: number;
}

interface ICategoriesRepository {
  create({ name, barcode, color }: ICreateCategoryDTO): Promise<void>;
  delete(id: string): Promise<void>;
  find(name: string): Promise<Category[]>;
  update(id: string, data: ICreateCategoryDTO): Promise<void>;
  list(): Promise<Category[]>;
  findByName(name: string): Promise<Category>;
  findById(id: string): Promise<Category | undefined>;
}

export { ICategoriesRepository, ICreateCategoryDTO };
