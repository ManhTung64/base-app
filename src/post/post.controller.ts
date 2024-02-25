import { Body, Controller, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthenticationGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { Role } from '../user/entities/user.entity';
import { CreatePost, UpdatePost } from './dto/post.dto';
import { PostContent } from './entities/post.entity';
import { Request, Response } from 'express'
import { CacheInterceptor } from '../interceptor/cache.interceptor';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api/post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Post('create')
    @UseGuards(AuthenticationGuard, RolesGuard)
    @Roles(Role.user)
    @UseInterceptors(FilesInterceptor('files', 4))
    async create(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addMaxSizeValidator({ maxSize: 100000 })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                })
        ) files: Express.Multer.File[],
        @Req() req: Request,
        @Body() post: CreatePost,
        @Res() res: Response) {
        post.userId = req['user'].accountId
        const data: PostContent = await this.postService.create(post, files)
        res.status(HttpStatus.OK).json({ data })
    }
    @Patch('update')
    @UseGuards(AuthenticationGuard, RolesGuard)
    @Roles(Role.user)
    async update(@Req() req: Request, @Body() post: UpdatePost, @Res() res: Response) {
        post.userId = req['user'].accountId
        const data: PostContent = await this.postService.update(post)
        res.status(HttpStatus.OK).json({ data })
    }
    @Get('getbyuser/:id')
    @UseInterceptors(CacheInterceptor)
    async getByUser(@Param('id', new ParseIntPipe()) id: number, @Res() res: Response) {
        const data: PostContent[] = await this.postService.getListPostByUser(id)
        res.status(HttpStatus.OK).json({ data })
    }
    @Get(':id')
    @UseInterceptors(CacheInterceptor)
    async getPost(@Param('id', new ParseIntPipe()) id: number, @Res() res: Response) {
        const data: PostContent = await this.postService.getPost(id)
        res.status(HttpStatus.OK).json({ data })
    }
    @Get('getall')
    @UseInterceptors(CacheInterceptor)
    async getAll(@Res() res: Response) {
        const data: PostContent[] = await this.postService.getAllPost()
        res.status(HttpStatus.OK).json({ data })
    }
}
