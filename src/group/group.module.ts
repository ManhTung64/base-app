import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupRepository } from './group.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Group]),
    UserModule
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
  exports:[GroupService]
})
export class GroupModule {}
