import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { CreateUserDto, LoginDto, UserDto, UserTokenDto } from './dto/user.dto';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){

    }
    @Get('/getall')
    @UseGuards(AuthenticationGuard)
    async getAll (@Req() req:Request, @Res() res:Response){
        try{
            const data:Array<UserDto> = await this.userService.getAllUser()
            if (!data) return res.status(HttpStatus.BAD_REQUEST).json({})
            else if (data.length == 0) return res.status(HttpStatus.NOT_FOUND).json({})
            else return res.status(HttpStatus.OK).json({data})
        }catch(error){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
        }
    }
    @Get('/getonewithprofile')
    @UseGuards(AuthenticationGuard)
    async getOneWithProfile (@Req() req:Request, @Res() res:Response){
        try{
            const data:User = await this.userService.getUserWithProfile(req['user'].username)
            if (!data) return res.status(HttpStatus.BAD_REQUEST).json({})
            return res.status(HttpStatus.OK).json({data})
        }catch(error){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
        }
    }
    @Post('/addnew')
    async createNewUser (@Body() createNewUser:CreateUserDto, @Res() res:Response){
        try{
            const data:UserDto = await this.userService.createNewUser(createNewUser)
            if (!data) return res.status(HttpStatus.BAD_REQUEST).json({})
            else return res.status(HttpStatus.OK).json({data})
        }catch(error){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
        }
    }
    @Post('/login')
    async login (@Body() loginInfo:LoginDto, @Res() res:Response){
        try{
            const data:UserTokenDto = await this.userService.login(loginInfo)
            if (!data) return res.status(HttpStatus.BAD_REQUEST).json({message:"Login failed"})
            else return res.status(HttpStatus.OK).json({data})
        }catch(error){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
        }
    }
}
