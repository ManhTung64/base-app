import { Body, Controller, FileTypeValidator, Get, HttpCode, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, ParseFilePipeBuilder, ParseIntPipe, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { CreateUserDto, LoginDto, UserDto, UserTokenDto } from './dto/user.dto';
import { AuthenticationGuard } from 'src/auth/auth.guard';
import { Role, User } from './entities/user.entity';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { CacheInterceptor } from 'src/interceptor/cache.interceptor';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateDto } from './dto/profile.dto';
import { Profile } from './entities/profile.entity';
import { rmSync } from 'fs';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){

    }
    @Get('/getall')
    @UseGuards(AuthenticationGuard, RolesGuard)
    @Roles(Role.user)
    @UseInterceptors(CacheInterceptor)
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
            console.log(req['user'])
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
    @Put(':id')
    async updateInformation (@Param('id',new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE})) id:number, @Body() update:UpdateDto, @Res() res:Response){
        try{
            const data:Profile = await this.userService.updateProfile(id,update)
            if (!data) return res.status(HttpStatus.BAD_REQUEST).json()
            return res.status(HttpStatus.OK).json({data:data})
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
    @Post('/uploadsinglefile')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSingleFile (@UploadedFile(
        new ParseFilePipe({
            validators:[
                new MaxFileSizeValidator({maxSize:100000,message:'File is so large'}),
                new FileTypeValidator({fileType:'image'})
            ]
        })
    ) file:Express.Multer.File, @Res() res:Response){
        try{
            if (!file) return res.status(HttpStatus.BAD_REQUEST).json()
            console.log("upload successful")
            return res.status(HttpStatus.OK).json()
        }catch(error){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
        }
    }
    @Post('/uploadmanyfile')
    @UseInterceptors(FilesInterceptor('files',3))
    async uploadMulFile (@UploadedFile(
        new ParseFilePipeBuilder()
        .addFileTypeValidator({fileType:'jpg'})
        .addMaxSizeValidator({maxSize:10000})
        .build({
            errorHttpStatusCode:HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) files:Express.Multer.File[], @Res() res:Response){
        try{
            if (files.length == 0) return res.status(HttpStatus.BAD_REQUEST).json()
            console.log("upload successful")
            return res.status(HttpStatus.OK).json()
        }catch(error){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
        }
    }
    @Post('/uploadmanyfieldfile')
    @UseInterceptors(FileFieldsInterceptor([
        {name:'avatar',maxCount:1},
        {name:'background',maxCount:1}
    ]))
    async uploadManyFieldFile (@UploadedFile() files:{ avt:Express.Multer.File[],bg?:Express.Multer.File}, @Res() res:Response){
        try{
            if (!files.avt) return res.status(HttpStatus.BAD_REQUEST).json()
            console.log("upload successful")
            return res.status(HttpStatus.OK).json()
        }catch(error){
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
        }
    }
}
