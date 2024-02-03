import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, LoginDto, UserDto, UserTokenDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { PasswordService } from './password/password.service';
import { AuthService } from 'src/auth/auth.service';
import { ProfileService } from './profile/profile.service';
import { Profile } from './entities/profile.entity';
import { UpdateDto } from './dto/profile.dto';
import { profile } from 'console';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository, private readonly passwordService: PasswordService,
        private readonly authService: AuthService, private readonly profileService: ProfileService) {

    }
    public async getAllUser(): Promise<UserDto[]> {
        try {
            const data: UserDto[] = await this.userRepository.findAll()
            return data
        } catch (error) {
            return null
        }
    }
    public async getUserWithProfile(username: string): Promise<User> {
        try {
            const user: User = await this.userRepository.findOneByUsername(username)
            if (!user) return null
            const data: User = await this.userRepository.joinWithProfileAndFind(user)
            return data
        } catch (error) {
            return null
        }
    }
    public async createNewUser(createUserDto: CreateUserDto): Promise<UserDto> {
        try {
            // check exsited
            if (await this.userRepository.findOneByUsername(createUserDto.username)) return null
            // hass password
            createUserDto.password = await this.passwordService.hashPassword(createUserDto.password)
            const newUser: User = await this.userRepository.createNew(createUserDto)
            // create default profile with null information
            const profile: Profile = await this.profileService.createDefaultProfile(newUser)
            await this.userRepository.update(newUser.id, profile)
            return new UserDto(newUser.username, newUser.isActive, newUser.createAt)
        } catch (error) {
            return null
        }
    }
    public async login(loginDto: LoginDto): Promise<UserTokenDto> {
        try {
            // check exsited
            const user: User = await this.userRepository.findOneByUsername(loginDto.username)
            if (!user) return null
            // check valid password
            else if (!await this.passwordService.verifyPassword(user.password, loginDto.password)) return null
            // return with token
            else return new UserTokenDto(user.username, user.isActive, user.createAt, await this.authService.createToken(user))
        } catch (error) {
            return null
        }
    }
    public async updateProfile(id: number, updateDto: UpdateDto): Promise<Profile> {
        try {
            return await this.userRepository.update(id,updateDto)
        } catch (error) {
            return null
        }
    }
}
