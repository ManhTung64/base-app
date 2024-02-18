import { IsNotEmpty, IsOptional, MinLength } from "class-validator"
import { Profile } from "src/user/entities/profile.entity"

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