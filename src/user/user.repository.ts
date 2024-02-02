import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role, User } from "./entities/user.entity";
import { Repository, UpdateResult } from "typeorm";
import { CreateUserDto } from "./dto/user.dto";
import { BaseRepository } from "src/base/base.repository";
import { Profile } from "./entities/profile.entity";

@Injectable()
export class UserRepository extends BaseRepository<User>{
    constructor(@InjectRepository(User) private userRepository:Repository<User>){
        super(userRepository)
    }
    public async createNew(createUserDto:CreateUserDto):Promise<User>{
        try{
            return await this.userRepository.save(this.userRepository.create({...createUserDto,createAt:new Date()}))
        }catch(error){
            return null
        }
    }
    public async findOneByUsername (inputUsername:string):Promise<User>{
        try{
            return await this.userRepository.findOneBy({username:inputUsername})
        }catch(error){
            return null
        }
    }
    public async update(id:number,profile:Profile): Promise<UpdateResult> {
        try {
            return await this.userRepository.update(id,{profile:profile})
        } catch (error) {
            return null
        }
    }
    public async joinWithProfileAndFind(user:User):Promise<User>{
        try{
            const data:User = await this.userRepository
            .createQueryBuilder('users')                             
            .innerJoinAndSelect('users.profile','profile')
            .where('users.id = :userId',{userId:user.id})
            .getOne()
            return data
        }catch(error){
            return  null
        }
    }
}