import { IsNotEmpty, IsOptional, MinLength } from "class-validator"
import { Profile } from "../../user/entities/profile.entity"
import { UploadFile } from "src/file/dto/file.dto"
import { FileInfo } from "../entities/post.entity"

export class CreatePost{
    @IsNotEmpty()
    @MinLength(1)
    title:string
    @IsNotEmpty()
    content:string
    @IsOptional()
    userId:number
    @IsOptional()
    user:Profile
    @IsOptional()
    files: FileInfo[]
}

export class UpdatePost{
    @IsOptional()
    @MinLength(1)
    title:string
    @IsOptional()
    content:string
    @IsOptional()
    userId:number
    @IsNotEmpty()
    id:number
}