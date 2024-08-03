import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { Product } from "./Product";

@Entity({ name: "barcode" })
class Barcode {
  @PrimaryColumn()
  id: string;

  @Column()
  code: string;

  @ManyToOne(() => Product, (product) => product.barcode)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column()
  created_at: Date;

  constructor(code?: string, product?: Product, created_at?: Date) {
    if (!this.id) {
      this.id = uuidv4();
    }
    this.code = code;
    this.product = product;
    if (created_at) {
      this.created_at = created_at;
    } else {
      this.created_at = new Date();
    }
  }
}

export { Barcode };
