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
export class UserTokenDto extends UserDto{
    token:string
    constructor(username:string,isActive:boolean,createAt:Date, token:string){
        super(username,isActive,createAt)
        this.token = token
    }
}