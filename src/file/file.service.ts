import { Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';
import { UploadFile } from './dto/file.dto';
import { FileInfo } from 'src/post/entities/post.entity';

@Injectable()
export class FileService {
    private defaultAvatar = 'https://i.stack.imgur.com/l60Hf.png'
    constructor(private readonly s3Service: S3Service) { }

    public getDefaulAvatar = () => {
        return this.defaultAvatar
    }
    public async uploadAvatar(avatar: UploadFile): Promise<string> {
        return await this.s3Service.UploadOneFile(avatar)
    }
    public async uploadImagesOfPost(files: UploadFile[]): Promise<FileInfo[]> {
        if (files.length == 0) throw Error("Missing file")
        const urls: string[] = await this.s3Service.UploadManyFiles(files)
        let list:FileInfo[] = []
        files.map((file, index)=>{
            const finalFile:FileInfo = {type:this.checkTypeFile(file),url:urls[index],no:index}
            list.push(finalFile)
        })
        return list
    }
    private checkTypeFile(file: UploadFile):string {
        if (file.mimetype.startsWith('image/')) {
            return 'image';
        } else if (file.mimetype.startsWith('video/')) {
            return 'video';
        }
    }
}
