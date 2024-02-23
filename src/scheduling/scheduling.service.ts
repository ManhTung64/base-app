import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class SchedulingService {
    constructor(private readonly mailService: MailService) { }
    @Cron(CronExpression.EVERY_8_HOURS)
    handleCron() {
        this.mailService.sendDailyReport()
    }
}
