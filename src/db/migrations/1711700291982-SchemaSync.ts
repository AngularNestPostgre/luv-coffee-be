import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1711700291982 implements MigrationInterface {
    name = 'SchemaSync1711700291982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" ADD "descriptions_new" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "descriptions_new"`);
    }

}
