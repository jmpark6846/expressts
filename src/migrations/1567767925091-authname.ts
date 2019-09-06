import {MigrationInterface, QueryRunner} from "typeorm";

export class authname1567767925091 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "name" TO "username"`);
    }

}
