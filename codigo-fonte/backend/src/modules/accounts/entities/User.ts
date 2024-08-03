import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity({ name: "user" })
class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @Column()
  level: number;

  constructor(name?: string, password?: string, level?: number) {
    if (!this.id) {
      this.id = uuidV4();
    }
    this.name = name;
    this.password = password;
    this.level = level;
  }
}

export { User };
