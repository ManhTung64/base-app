import { BaseRepository } from "../base/base.repository";
import { PostContent } from "./entities/post.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { CreatePost } from "./dto/post.dto";
import { Profile } from "../user/entities/profile.entity";
import { PaginationDto } from "./dto/pagination.dto";
import { limits } from "argon2";

@Injectable()
export class PostRepository extends BaseRepository<PostContent>{
    constructor(@InjectRepository(PostContent) private postRepository: Repository<PostContent>) {
        super(postRepository)
    }
    public async createNew(createPostDto: CreatePost): Promise<PostContent> {
        return await this.postRepository.save(this.postRepository.create({ ...createPostDto }))
    }
    public async findOneById(id: number): Promise<PostContent> {
        return await this.postRepository.findOne({ where: { id: id } })
    }
    public async update(post: PostContent, updatePost: any): Promise<PostContent> {
        post =
        {
            ...post,
            title: updatePost.title ? updatePost.title : post.title,
            content: updatePost.content ? updatePost.content : post.content
        }
        return await this.postRepository.save(post)
    }
    public async getByUser (profile:Profile):Promise<PostContent[]>{
        return await this.postRepository.find({where:{user:profile}})
    }
    public async findWithPagination (pagination:PaginationDto):Promise<PostContent[]>{
        return await this.postRepository.find({
            skip:pagination.page - 1 * pagination.limit,
            take: pagination.limit
        })
    }
    public async findByName (name:string):Promise<PostContent[]>{
        return await this.postRepository.find({
            where:{
                title:Like(`%${name}%`)
            },
        })
    }
}