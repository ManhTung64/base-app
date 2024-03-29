import { IsOptional, Length } from "class-validator"
import { UploadFile } from "src/file/dto/file.dto"

export class UpdateDto{
    @IsOptional()
   name:string
   @IsOptional()
   @Length(10)
   phonenumber:string
   @IsOptional()
   dob:Date
   @IsOptional()
   avatar:UploadFile
   @IsOptional()
   id:number
}