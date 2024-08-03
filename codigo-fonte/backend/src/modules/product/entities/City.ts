import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity({ name: "city" })
class City {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  state: string;

  constructor(name?: string, state?: string) {
    if (!this.id) {
      this.id = uuidv4();
    }
    this.name = name;
    this.state = state;
  }
}

export { City };
