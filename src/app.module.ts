import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { InterceptorModule } from './interceptor/interceptor.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { PostModule } from './post/post.module';
import { GroupModule } from './group/group.module';
import ormconfig = require('./configuration/typeorm.config')
import { AppGateway } from './event.gateway';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SchedulingModule } from './scheduling/scheduling.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
          password: config.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),UserModule, TypeOrmModule.forRoot(ormconfig[0]), AuthModule, InterceptorModule, ConfigurationModule, PostModule, GroupModule, MailModule, SchedulingModule, FileModule],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
