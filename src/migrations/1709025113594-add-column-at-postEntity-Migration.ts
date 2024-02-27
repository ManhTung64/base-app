import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnAtPostEntityMigration1709025113594 implements MigrationInterface {
    name = 'AddColumnAtPostEntityMigration1709025113594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "otherss" TO "hashtag"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "hashtag" TO "otherss"`);
    }

}
