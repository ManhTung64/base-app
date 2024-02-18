import { BadRequestException, Injectable } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
import { User } from '../entities/user.entity';
import { ProfileRepository } from './profile.repository';
import { UpdateDto } from '../dto/profile.dto';

@Injectable()
export class ProfileService {
    constructor(private readonly profileRepository: ProfileRepository) {

    }
    public async createDefaultProfile(user: User): Promise<Profile> {
        if (!user.id) throw new BadRequestException()
        return await this.profileRepository.createDefault(user)
    }
    public async update(update: UpdateDto): Promise<Profile> {
        // const profile:Profile = await this.profileRepository.updateProfile(update)
        // return profile
        return null
    }
}
