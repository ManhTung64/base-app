import { User } from "src/user/entities/user.entity";
import { EntityManager, MigrationInterface, QueryRunner, Table, getRepository } from "typeorm";

export class FirstMigration1707205529376 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'state',
            columns: [
              {
                name: 'id',
                type: 'uuid',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
              },
              {
                name: 'state',
                type: 'varchar',
                length: '255',
              },
            ],
          }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('state')
    }
}
