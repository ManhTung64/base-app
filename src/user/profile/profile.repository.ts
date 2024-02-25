import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Profile } from "../entities/profile.entity";
import { BaseRepository } from "../../base/base.repository";
import { User } from "../entities/user.entity";
import { Group } from "../../group/entities/group.entity";

@Injectable()
export class ProfileRepository extends BaseRepository<Profile>{
    constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>) {
        super(profileRepository)
    }
    public async createDefault(user: User, avatar:string): Promise<Profile> {
        return await this.profileRepository.save(this.profileRepository.create({ name: 'new-user', user: user, avatar:avatar }))
    }
    public async updateProfile(profile: any): Promise<UpdateResult> {
        return await this.profileRepository.update(profile.id, { ...profile })
    }
    public async findOneById(userId:number): Promise<Profile> {
        return await this.profileRepository.findOne({ where: { user: {id:userId} } })
    }
    public async addGroup(profile:Profile): Promise<Profile> {
        return await this.profileRepository.save(profile)
    }
}