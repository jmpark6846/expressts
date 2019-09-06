import {MigrationInterface, QueryRunner} from "typeorm";

export class wow1567766424333 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "name" TO "username"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "name"`);
    }

}
