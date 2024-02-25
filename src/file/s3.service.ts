import s3Config from "src/configuration/s3.config";
import { UploadFile } from "./dto/file.dto";
import { ObjectCannedACL, PutObjectAclCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

@Injectable()
export class S3Service {
    private bucketName: string = 'webep'
    private avatarFolder: string = 'Avatar/'
    private Expries: Date = new Date('2026-01-01T00:00:00Z')
    private generateRandom8DigitNumber() {
        const min = 10000000;
        const max = 99999999;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }
    private createParamsUpload = (file: UploadFile) => {
        const params = {
            Bucket: this.bucketName,
            Key: `${this.avatarFolder}${this.generateRandom8DigitNumber()}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            Expires: this.Expries,
        }
        return params
    }
    public UploadOneFile = async (file: UploadFile): Promise<string> => {
        if (!file) throw new Error('Missing file')
        let params = this.createParamsUpload(file)
        await s3Config.send(new PutObjectCommand(params))

        const aclParams = {
            Bucket: this.bucketName,
            Key: params.Key,
            ACL: ObjectCannedACL.public_read
        };
        await s3Config.send(new PutObjectAclCommand(aclParams));

        return `https://${this.bucketName}.s3.${process.env.REGION}.amazonaws.com/` + params.Key
    }
    public UploadManyFiles = async (files: Array<UploadFile>): Promise<Array<string>> => {

        if (!files) throw new Error('Missing file')
        let urls: Array<string> = []
        for (let i: number = 0; i < files.length; i++) {
            urls.push(await this.UploadOneFile(files[i]))
        }
        return urls
    }
}