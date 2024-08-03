import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { City } from "./City";

@Entity({ name: "market" })
class Market {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @ManyToOne(() => City)
  @JoinColumn({ name: "city_id" })
  city: City;

  constructor(name?: string, city?: City) {
    if (!this.id) {
      this.id = uuidv4();
    }
    this.name = name;
    this.city = city;
  }
}

export { Market };
