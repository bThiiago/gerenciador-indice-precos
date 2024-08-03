/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
/* eslint-enable @typescript-eslint/no-unused-vars */
import { v4 as uuidv4 } from "uuid";

import { Barcode } from "./Barcode";
import { Category } from "./Category";

@Entity({ name: "product" })
class Product {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Barcode, (barcode) => barcode.product)
  barcode: Barcode[];

  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @Column()
  created_at: Date;

  constructor(
    name?: string,
    category?: Category,
    barcode?: Barcode[],
    created_at?: Date,
  ) {
    if (!this.id) {
      this.id = uuidv4();
    }
    this.name = name;
    this.barcode = barcode;
    this.category = category;
    if (created_at) {
      this.created_at = created_at;
    } else {
      this.created_at = new Date();
    }
  }
}

export { Product };
