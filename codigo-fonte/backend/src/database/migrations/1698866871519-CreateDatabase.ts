import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabase1698866871519 implements MigrationInterface {
  name = "CreateDatabase1698866871519";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "level" integer NOT NULL, CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" character varying NOT NULL, "name" character varying NOT NULL, "state" character varying NOT NULL, CONSTRAINT "PK_1e9a2963edfd331d92018e3bcac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "market" ("id" character varying NOT NULL, "name" character varying NOT NULL, "city_id" character varying, CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" character varying NOT NULL, "name" character varying NOT NULL, "barcode" boolean NOT NULL, "color" integer, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" character varying NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "category_id" character varying, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "barcode" ("id" character varying NOT NULL, "code" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "product_id" character varying, CONSTRAINT "PK_bebc9158e480b949565b4dc7b97" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "research" ("id" character varying NOT NULL, "price" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL, "market_id" character varying, "product_id" character varying, CONSTRAINT "PK_be0614c6e72bbe071af7b1b3586" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "barcode" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04cef9" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "research" ADD CONSTRAINT "FK_aadca42d8d2e918745fd15800af" FOREIGN KEY ("market_id") REFERENCES "market"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "research" ADD CONSTRAINT "FK_7a8823c70bb4fd499a773a1b270" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "market" ADD CONSTRAINT "FK_7a8823c70bb4fd499a773a2c382" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "market" DROP CONSTRAINT "FK_7a8823c70bb4fd499a773a2c382"`,
    );
    await queryRunner.query(
      `ALTER TABLE "research" DROP CONSTRAINT "FK_7a8823c70bb4fd499a773a1b270"`,
    );
    await queryRunner.query(
      `ALTER TABLE "research" DROP CONSTRAINT "FK_aadca42d8d2e918745fd15800af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "barcode" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04cef9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"`,
    );
    await queryRunner.query(`DROP TABLE "research"`);
    await queryRunner.query(`DROP TABLE "barcode"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "market"`);
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
