import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePost, UpdatePost } from './dto/post.dto';
import { PostContent } from './entities/post.entity';
import { PostRepository } from './post.repository';
import { ProfileRepository } from '../user/profile/profile.repository';
import { Profile } from '../user/entities/profile.entity';
import { UploadFile } from 'src/file/dto/file.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class PostService {
    constructor(private readonly postRepository: PostRepository, private readonly profileRepository: ProfileRepository,
        private readonly fileService:FileService) { }

    public async create(newPost: CreatePost, files:UploadFile[]): Promise<PostContent> {
        // check ex user
        const profile: Profile = await this.profileRepository.findOneById(newPost.userId)
        if (!profile) throw new BadRequestException()
        newPost.user = profile
        if (files.length > 0) newPost.files = await this.fileService.uploadImagesOfPost(files)
        // add new
        return await this.postRepository.createNew(newPost)
    }
    public async update(updatePost: UpdatePost): Promise<PostContent> {
        let post: PostContent = await this.postRepository.findOneById(updatePost.id)
        if (!post) throw new NotFoundException('Data is not found')
        // check ex user and permission
        const profile: Profile = await this.profileRepository.findOneById(updatePost.userId)
        if (!profile || profile.id != post.user.id) throw new BadRequestException()
        return await this.postRepository.update(post, updatePost)
    }
    public async getListPostByUser(userId:number):Promise<PostContent[]>{
        const profile: Profile = await this.profileRepository.findOneById(userId)
        if (!profile) throw new NotFoundException()

        const listPost:PostContent[] = await this.postRepository.getByUser(profile)
        if (listPost.length == 0) throw new NotFoundException()
        else return listPost
    }
    public async getPost(id:number):Promise<PostContent>{
        const post:PostContent = await this.postRepository.findOneById(id)
        if (!post) throw new NotFoundException()
        else return post
    }
    public async getAllPost():Promise<PostContent[]>{
        const post:PostContent[] = await this.postRepository.findAll()
        if (post.length == 0) throw new NotFoundException()
        else return post
    }
}
