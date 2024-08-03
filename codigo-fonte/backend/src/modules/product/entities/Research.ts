import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { Market } from "./Market";
import { Product } from "./Product";

@Entity({ name: "research" })
class Research {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Market)
  @JoinColumn({ name: "market_id" })
  market: Market;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column("float")
  price: number;

  @Column()
  created_at: Date;

  constructor(
    product?: Product,
    price?: number,
    market?: Market,
    created_at?: Date,
  ) {
    if (!this.id) {
      this.id = uuidv4();
    }
    this.market = market;
    this.product = product;
    this.price = price;
    if (created_at) {
      this.created_at = created_at;
    } else {
      this.created_at = new Date();
    }
  }
}

export { Research };
