import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role, User } from "./entities/user.entity";
import { LessThan, Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "./dto/user.dto";
import { BaseRepository } from "../base/base.repository";
import { Profile } from "./entities/profile.entity";
import { UpdateDto } from "./dto/profile.dto";

@Injectable()
export class UserRepository extends BaseRepository<User>{
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {
        super(userRepository)
    }
    public async createNew(createUserDto: CreateUserDto): Promise<User> {
        return await this.userRepository.save(this.userRepository.create({ ...createUserDto, createAt: new Date() }))
    }
    public async findOneByUsername(inputUsername: string): Promise<User> {
        return await this.userRepository.findOneBy({ username: inputUsername })
    }
    public async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne({ where: { id: id } })
    }
    public async update(user: User, updateDto: Profile): Promise<Profile> {
        user.profile = { ...user.profile, name: updateDto.name, phonenumber: updateDto.phonenumber, dob: updateDto.dob }
        await this.save(user)
        return user.profile
    }
    public async save(user:User):Promise<User>{
        await this.userRepository.save(user)
        return user
    }
    public async findAllNewUser(): Promise<User[]> {
        return await this.userRepository.find({where:{createAt:LessThan(new Date())}})
    }
    public async joinWithProfileAndFind(user: User): Promise<User> {
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
    }

}