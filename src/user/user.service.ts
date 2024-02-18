import { BadRequestException, Injectable, NotFoundException, UseFilters } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, LoginDto, UserDto, UserTokenDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { PasswordService } from './password/password.service';
import { AuthService } from 'src/auth/auth.service';
import { ProfileService } from './profile/profile.service';
import { Profile } from './entities/profile.entity';
import { UpdateDto } from './dto/profile.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { MailCode } from 'src/mail/dto/mail.dto';

@Injectable()
export class UserService {
    private MIN:number = 100000
    private MAX:number = 999999
    constructor(@InjectQueue('mail-queue') private readonly queue:Queue,
    private userRepository: UserRepository, private readonly passwordService: PasswordService,
        private readonly authService: AuthService, private readonly profileService: ProfileService,) {

    }
    public async getAllUser(): Promise<UserDto[]> {
        const data: UserDto[] = await this.userRepository.findAll()
        if (!data) throw new BadRequestException()
        else if (data.length == 0) throw new NotFoundException('Data is not found')
        else return data
    }
    public async getUserWithProfile(username: string): Promise<User> {
        const user: User = await this.userRepository.findOneByUsername(username)
        if (!user) throw new BadRequestException('Information is invalid')
        const data: User = await this.userRepository.joinWithProfileAndFind(user)
        if (!data) throw new BadRequestException()
        return data
    }
    public async createNewUser(createUserDto: CreateUserDto): Promise<UserDto> {
        // check exsited
        if (await this.userRepository.findOneByUsername(createUserDto.username)) throw new BadRequestException('Username is exsited')
        // hass password
        createUserDto.password = await this.passwordService.hashPassword(createUserDto.password)
        const newUser: User = await this.userRepository.createNew(createUserDto)
        //queue send mail verify
        const mailInformation:MailCode = {to:createUserDto.username}
        await this.queue.add('send-code',mailInformation,{removeOnComplete:true})
        // create default profile with null information
        const profile: Profile = await this.profileService.createDefaultProfile(newUser)
        await this.userRepository.update(newUser, profile)
        return new UserDto(newUser.username, newUser.isActive, newUser.createAt)
    }
    public async login(loginDto: LoginDto): Promise<UserTokenDto> {
        // check exsited
        const user: User = await this.userRepository.findOneByUsername(loginDto.username)
                //queue send mail verify
                const mailInformation:MailCode = {to:loginDto.username}
                await this.queue.add('send-code',{to:loginDto.username},{removeOnComplete:true})
        if (!user) throw new BadRequestException('Information is invalid')

        // check valid password
        else if (!await this.passwordService.verifyPassword(user.password, loginDto.password)) throw new BadRequestException('Information is invalid')
        // return with token
        else return new UserTokenDto(user.username, user.isActive, user.createAt, await this.authService.createToken(user))
    }
    public async updateProfile(id: number, updateDto: UpdateDto): Promise<Profile> {
        const user: User = await this.userRepository.findOneById(id)
        if (!user) throw new BadRequestException('User is invalid')
        return await this.userRepository.update(user, updateDto)
    }
    public createCode() {
        const randomNumber = Math.floor(Math.random() * (this.MAX - this.MIN + 1)) + this.MIN;
        const randomString = randomNumber.toString();
        return randomString;
    }
}
