import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { S3Service } from './s3.service';

@Module({
  providers: [FileService, S3Service]
})
export class FileModule {}
