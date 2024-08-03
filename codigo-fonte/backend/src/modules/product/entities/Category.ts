/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { Product } from "./Product";

@Entity({ name: "category" })
class Category {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  barcode: boolean;

  @Column()
  color: number;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  constructor(name?: string, barcode?: boolean, color?: number) {
    if (!this.id) {
      this.id = uuidv4();
    }
    this.name = name;
    this.barcode = barcode;
    this.color = color;
  }
}

export { Category };
