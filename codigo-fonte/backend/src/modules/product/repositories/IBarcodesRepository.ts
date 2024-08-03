import { Barcode } from "../entities/Barcode";
import { Product } from "../entities/Product";

interface ICreateBarcodeDTO {
  code: string;
  product: Product;
  created_at?: Date;
}

interface IBarcodesRepository {
  create({ code, product }: ICreateBarcodeDTO): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Barcode | null>;
  findByCode(code: string): Promise<Barcode | null>;
  findByProduct(product: string): Promise<Barcode[]>;
}

export { IBarcodesRepository, ICreateBarcodeDTO };
