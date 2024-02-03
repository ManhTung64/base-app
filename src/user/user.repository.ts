import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role, User } from "./entities/user.entity";
import { Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "./dto/user.dto";
import { BaseRepository } from "src/base/base.repository";
import { Profile } from "./entities/profile.entity";
import { UpdateDto } from "./dto/profile.dto";

@Injectable()
export class UserRepository extends BaseRepository<User>{
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {
        super(userRepository)
    }
    public async createNew(createUserDto: CreateUserDto): Promise<User> {
        try {
            return await this.userRepository.save(this.userRepository.create({ ...createUserDto, createAt: new Date() }))
        } catch (error) {
            return null
        }
    }
    public async findOneByUsername(inputUsername: string): Promise<User> {
        try {
            return await this.userRepository.findOneBy({ username: inputUsername })
        } catch (error) {
            return null
        }
    }
    public async findOneById(id:number):Promise<User>{
        try{
            return await this.userRepository.findOne({where:{id:id}})
        }catch(error){
            return null 
        }
    }
    public async update(id: number, updateDto: UpdateDto): Promise<Profile> {
        try {
            const user: User = await this.findOneById(id)
            user.profile = { ...user.profile, name: updateDto.name, phonenumber: updateDto.phonenumber, dob: updateDto.dob }
            await this.userRepository.save(user)
            return user.profile
        } catch (error) {
            return null
        }
    }
    public async joinWithProfileAndFind(user: User): Promise<User> {
        try {
            // return await this.userRepository.findOne({where:{id:user.id},relations:['profile']})
            const data: User = await this.userRepository
                .createQueryBuilder('users')
                .innerJoinAndSelect('users.profile', 'profile')
                .where('users.id = :userId', { userId: user.id })
                .orderBy('users.createAt', "DESC")
                .getOne()

            const data2 = await this.userRepository.createQueryBuilder('users')
                .select(["users.id", "users.username"])
                .where("users.createAt < :now", { now: new Date() })
                .orWhere("users.isActive = :active", { active: false })
                .offset(1)
                .getMany()

            const users = await this.userRepository
                .createQueryBuilder('users')
                .select(['SUM(users.) as totalAmount'])
                .groupBy('user.id')
                .getMany();

                // const posts = await this.userRepository
                // .createQueryBuilder('post')
                // .leftJoinAndSelect('post.comments', 'comment')
                // .leftJoinAndSelect('post.user', 'user')
                // .select(['post.id', 'post.title', 'COUNT(comment.id) as commentCount', 'user.username'])
                // .groupBy('post.id, users.id')
                // .having('commentCount >= :minCommentCount', { minCommentCount: 5 })
                // .getRawMany();
                
            console.log(data2)
            console.log(users)
            return data
        } catch (error) {
            return null
        }
    }

}