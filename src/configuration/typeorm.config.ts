
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export = [
  {
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'postgres',
    password: 'Manhtung1@',
    database: 'test',
    entities:['dist/**/*.entity{.ts,.js}'],
    migrations:['src/migrations'],
    synchronize: true,
    cli: {
      migrationsDir: 'src/migrations',
    }
} as TypeOrmModuleOptions]