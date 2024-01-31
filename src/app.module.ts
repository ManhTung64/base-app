import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { Profile } from './user/entities/profile.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Manhtung1@',
    database: 'test',
    entities:[User,Profile],
    synchronize: true, // shoudl: dev env
  }), AuthModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}
