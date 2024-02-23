import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { PasswordService } from './password/password.service';
import { AuthModule } from '../auth/auth.module';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './profile/profile.service';
import { ProfileRepository } from './profile/profile.repository';
import { BullModule } from '@nestjs/bull';
import { MailConsumer } from './consumer/mail.consumer';
import { MailModule } from '../mail/mail.module';
import { CodeService } from './code.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([User,Profile]),
    AuthModule,
  //  forwardRef(()=>QueueModule),
    BullModule.registerQueue({
        name:'mail-queue'
    }),
    forwardRef(()=>MailModule) 
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, PasswordService, ProfileService, ProfileRepository, MailConsumer, CodeService],
  exports:[ProfileRepository, UserRepository, CodeService]
})
export class UserModule {}
