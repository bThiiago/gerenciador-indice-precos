import { Market } from "../entities/Market";
import { Product } from "../entities/Product";
import { Research } from "../entities/Research";

interface ICreateResearchDTO {
  market: Market;
  product: Product;
  price: number;
  created_at?: Date;
}

interface IUpdateResearchDTO {
  market: Market;
  product: Product;
  price: number;
}

interface IResearchesRepository {
  create({
    market,
    product,
    price,
    created_at,
  }: ICreateResearchDTO): Promise<void>;
  list(page?: number, perPage?: number): Promise<Research[]>;
  delete(id: string): Promise<void>;
  update(id: string, data: ICreateResearchDTO): Promise<void>;
  findById(id: string): Promise<Research | undefined>;
  findByData(id: string): Promise<Research[]>;
  findByDataToExcel(id: string): Promise<Buffer>;
  meanMonthIndex(year: number): Promise<any[]>;
  meanMonthByCity(year: number, city?: string): Promise<any[]>;
  meanProductIndexByCategory(
    year: number,
    category: string,
    city?: string,
  ): Promise<any[]>;
}

export { IResearchesRepository, ICreateResearchDTO, IUpdateResearchDTO };
