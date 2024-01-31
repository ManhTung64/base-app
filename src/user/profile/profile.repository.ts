import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Profile } from "../entities/profile.entity";
import { BaseRepository } from "src/base/base.repository";
import { User } from "../entities/user.entity";

@Injectable()
export class ProfileRepository extends BaseRepository<Profile>{
    constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>) {
        super(profileRepository)
    }
    public async createDefault(user:User): Promise<Profile> {
        try {
            return await this.profileRepository.save(this.profileRepository.create({name:'new-user',user:user}))
        } catch (error) {
            return null
        }
    }
    public async updateProfile(profile:any): Promise<UpdateResult> {
        try {
            return await this.profileRepository.update(profile.id,{...profile})
        } catch (error) {
            return null
        }
    }
}