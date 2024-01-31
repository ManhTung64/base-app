import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { PasswordService } from './password/password.service';
import { AuthModule } from 'src/auth/auth.module';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './profile/profile.service';
import { ProfileRepository } from './profile/profile.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([User,Profile]),
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, PasswordService, ProfileService, ProfileRepository]
})
export class UserModule {}
