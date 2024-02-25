import { BadRequestException, Body, Controller, FileTypeValidator, Get, HttpCode, HttpException, HttpStatus, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { CreateUserDto, LoginDto, UserDto, UserTokenDto } from './dto/user.dto';
import { AuthenticationGuard } from '../auth/auth.guard';
import { Role, User } from './entities/user.entity';
import { RolesGuard } from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import { CacheInterceptor } from '../interceptor/cache.interceptor';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateDto } from './dto/profile.dto';
import { Profile } from './entities/profile.entity';
import { UserVerifyCodeDto } from './dto/code.dto';
import { ProfileService } from './profile/profile.service';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService:UserService, profileService:ProfileService){

    }
    @Get('/getall')
    @UseGuards(AuthenticationGuard, RolesGuard)
    @Roles(Role.user)
    @UseInterceptors(CacheInterceptor)
    async getAll (
        @Req() req:Request, 
        @Res() res:Response){
            const data:Array<UserDto> = await this.userService.getAllUser()
            return res.status(HttpStatus.OK).json({data})
    }
    @Get('/getonewithprofile')
    @UseGuards(AuthenticationGuard)
    async getOneWithProfile (
        @Req() req:Request, 
        @Res() res:Response){
            const data:User = await this.userService.getUserWithProfile(req['user'].username)
            return res.status(HttpStatus.OK).json({data})
    }
    @Post('/addnew')
    async createNewUser (
        @Body() createNewUser:CreateUserDto, 
        @Res() res:Response){
            const data:UserDto = await this.userService.createNewUser(createNewUser)
            return res.status(HttpStatus.OK).json({data})
    }
    @Put(':id')
    async updateInformation (
        @Param('id', new ParseIntPipe({errorHttpStatusCode:HttpStatus.NOT_ACCEPTABLE})) id:number, 
        @Body() update:UpdateDto, 
        @Res() res:Response){
            const data:Profile = await this.userService.updateProfile(update)
            return res.status(HttpStatus.OK).json({data:data})
    }
    @Post('/login')
    async login (
        @Body() loginInfo:LoginDto, 
        @Res() res:Response){
            const data:UserTokenDto = await this.userService.login(loginInfo)
            return res.status(HttpStatus.OK).json({data})
    }
    @Patch('verify')
    @UseGuards(AuthenticationGuard)
    async verifyUser (
        @Req() req:Request,
        @Res() res:Response,
        @Body() body:UserVerifyCodeDto
    ){
        body.userId = req['user'].userId
        const isVerify:boolean = await this.userService.verifyUser(body)
        if (!isVerify) return res.status(HttpStatus.BAD_REQUEST).json({message:"Code is invalid or expried"})
        else return res.status(HttpStatus.OK).json({})
    }
    @Post('/updateprofile')
    @UseGuards(AuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadSingleFile (
    @UploadedFile(
        new ParseFilePipe({
            validators:[
                new MaxFileSizeValidator({maxSize:100000, message:'File is so large'}),
                new FileTypeValidator({fileType:'image'})
            ]
        })
    ) file:Express.Multer.File, 
    @Req() req:Request,
    @Body() updateProfile:UpdateDto,
    @Res() res:Response){
        updateProfile.id = req['user'].userId
        if (file) updateProfile.avatar = file

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
            return res.status(HttpStatus.OK).json()
    }
    @Post('/uploadmanyfieldfile')
    @UseInterceptors(FileFieldsInterceptor([
        {name:'avatar',maxCount:1},
        {name:'background',maxCount:1}
    ]))
    async uploadManyFieldFile (@UploadedFile() files:{ avt:Express.Multer.File[],bg?:Express.Multer.File}, @Res() res:Response){
            return res.status(HttpStatus.OK).json()
    }
}
