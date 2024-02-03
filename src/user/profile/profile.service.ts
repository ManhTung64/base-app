import { Injectable } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
import { User } from '../entities/user.entity';
import { ProfileRepository } from './profile.repository';
import { UpdateDto } from '../dto/profile.dto';

@Injectable()
export class ProfileService {
    constructor(private readonly profileRepository:ProfileRepository){

    }
    public async createDefaultProfile (user:User):Promise<Profile>{
        try{
            if (!user.id) return null
            return await this.profileRepository.createDefault(user)
        }catch(error){
            return null
        }
    }
    public async update (update:UpdateDto):Promise<Profile>{
        try{
            // const profile:Profile = await this.profileRepository.updateProfile(update)
            // return profile
        }catch(error){
            return null
        }
    }
}
