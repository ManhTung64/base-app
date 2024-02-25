import { Module, forwardRef } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PostRepository } from './post.repository';
import { PostContent } from './entities/post.entity';
import { FileModule } from 'src/file/file.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([PostContent]),
    forwardRef(()=>UserModule),
    FileModule
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository]
})
export class PostModule {}
