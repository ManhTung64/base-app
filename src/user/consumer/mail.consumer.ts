import { Process, Processor } from "@nestjs/bull";
import { MailCode } from "src/mail/dto/mail.dto";
import { UserService } from "../user.service";
import { MailService } from "src/mail/mail.service";
import { Job } from "bull";

@Processor('mail-queue')
export class MailConsumer {
    constructor(private readonly mailService:MailService,
         private readonly userService:UserService
         ){

    }
    @Process('send-code')
    async sendMailQueue (data:Job){
        data.data.code = this.userService.createCode()
        await this.mailService.sendCode(data.data) 
        return
    }
}