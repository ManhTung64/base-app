import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailCode } from './dto/mail.dto';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService, private readonly userRepository:UserRepository) { }
    private mail:string = 'manhtungyb10a10@gmail.com'
    async sendCode(mailInformation:MailCode): Promise<void> {
        await this.mailerService.sendMail({
            // to: mailInformation.to,
            to: this.mail,
            subject: 'Your code',
            
            text: 'Your code is ' + mailInformation.code +'', 
        });
    }
    async sendDailyReport (){
        const newUser:User[] = await this.userRepository.findAllNewUser()
        await this.mailerService.sendMail({
            // to: mailInformation.to,
            to: this.mail,
            subject: 'Daily report',
            
            text: 'All new account is ' + newUser.length +'', 
        });
    }
}
