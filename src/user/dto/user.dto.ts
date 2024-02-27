import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto{
    @IsNotEmpty()
    @MinLength(6)
    username:string
    @IsNotEmpty()
    @IsStrongPassword()
    password:string
}
export class LoginDto extends CreateUserDto{

}
export class UserDto{
    constructor(username:string,isActive:boolean,createAt:Date){
        this.username = username
        this.isActive = isActive
        this.createAt = createAt
    }
    username:string
    // password:string
    isActive:boolean
    createAt:Date
}
@Exclude()
export class UserTokenDto{
    @Expose()
    token:string
    @Expose()
    username:string
    @Expose()
    isActive:boolean
    @Expose()
    createAt:Date
}