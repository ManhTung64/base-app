import { Module, forwardRef } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { PostRepository } from './post.repository';
import { PostContent } from './entities/post.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([PostContent]),
    forwardRef(()=>UserModule)
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository]
})
export class PostModule {}
