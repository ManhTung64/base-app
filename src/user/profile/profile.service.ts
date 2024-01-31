import { Injectable } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
import { User } from '../entities/user.entity';
import { ProfileRepository } from './profile.repository';

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
}
