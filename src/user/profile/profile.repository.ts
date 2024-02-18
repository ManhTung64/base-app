import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Profile } from "../entities/profile.entity";
import { BaseRepository } from "src/base/base.repository";
import { User } from "../entities/user.entity";
import { Group } from "src/group/entities/group.entity";

@Injectable()
export class ProfileRepository extends BaseRepository<Profile>{
    constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>) {
        super(profileRepository)
    }
    public async createDefault(user: User): Promise<Profile> {
        return await this.profileRepository.save(this.profileRepository.create({ name: 'new-user', user: user }))
    }
    public async updateProfile(profile: any): Promise<UpdateResult> {
        return await this.profileRepository.update(profile.id, { ...profile })
    }
    public async findOneById(id: number): Promise<Profile> {
        return await this.profileRepository.findOne({ where: { id: id } })
    }
    public async addGroup(profile:Profile): Promise<Profile> {
        return await this.profileRepository.save(profile)
    }
}