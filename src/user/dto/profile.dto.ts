import { IsOptional, Length } from "class-validator"

export class UpdateDto{
    @IsOptional()
   name:string
   @IsOptional()
   @Length(10)
   phonenumber:string
   @IsOptional()
   dob:Date
}