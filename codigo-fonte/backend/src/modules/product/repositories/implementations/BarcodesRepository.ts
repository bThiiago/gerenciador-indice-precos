import { UUID } from "crypto";
import { Repository, getRepository } from "typeorm";

import { Barcode } from "../../entities/Barcode";
import { ICreateBarcodeDTO, IBarcodesRepository } from "../IBarcodesRepository";

class BarcodeRepository implements IBarcodesRepository {
  private repository: Repository<Barcode>;

  constructor() {
    this.repository = getRepository(Barcode);
  }

  async create({
    code,
    product,
    created_at,
  }: ICreateBarcodeDTO): Promise<void> {
    const barcode = this.repository.create({
      code,
      product,
      created_at,
    });
    await this.repository.save(barcode);
  }

  async delete(id: string): Promise<void> {
    const barcode = await this.repository.findOne({
      relations: ["product"],
      where: { id },
    });

    await this.repository.delete(barcode);
  }

  async findById(id: string): Promise<Barcode | null> {
    const barcode = await this.repository.findOne({
      relations: ["product"],
      where: {
        id,
      },
    });

    return barcode;
  }

  async findByCode(code: string): Promise<Barcode | null> {
    const barcode = await this.repository.findOne({
      relations: ["product", "product.category"],
      where: {
        code,
      },
    });

    return barcode;
  }

  async findByProduct(product: string): Promise<Barcode[]> {
    const barcodes = await this.repository.find({
      relations: ["product"],
      where: {
        product: {
          name: product,
        },
      },
    });

    return barcodes;
  }
}

export { BarcodeRepository };
