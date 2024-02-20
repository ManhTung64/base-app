import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../user/user.service';
import ormconfig = require('../configuration/typeorm.config')
import { CreateUserDto, UserDto, UserTokenDto } from './dto/user.dto';
import { BadRequestException, HttpStatus, forwardRef } from '@nestjs/common';
// import { AppModule } from '../app.module';
import { UserModule } from './user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { AuthModule } from '../auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { MailModule } from '../mail/mail.module';
import { UserRepository } from './user.repository';
import { PasswordService } from './password/password.service';
import { ProfileService } from './profile/profile.service';
import { ProfileRepository } from './profile/profile.repository';
import { MailConsumer } from './consumer/mail.consumer';
import { Response, Request } from 'express';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService
  const mockRequest = {} as unknown as Request
  const mockJson = jest.fn().mockReturnThis()
  const mockRes:Response = {
    status: jest.fn((x)=>({
      json:jest.fn()
    })), // Mock the status method
    json: jest.fn().mockReturnThis()
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        TypeOrmModule.forRoot(ormconfig[0]),
        TypeOrmModule.forFeature([User,Profile]),
        AuthModule,
      //  forwardRef(()=>QueueModule),
        BullModule.registerQueue({
            name:'mail-queue'
        }),
        forwardRef(()=>MailModule) 
      ],
      controllers: [UserController],
      providers: [UserService, UserRepository, PasswordService, ProfileService, ProfileRepository, MailConsumer],
      
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be define', async()=>{
    expect(controller).toBeDefined()
  })
  it('should be return list user', async () => {
    const validObject:UserTokenDto = new UserTokenDto('username',true,new Date(),'valid token')
    jest.spyOn(service,'getAllUser').mockResolvedValue([validObject])

    await controller.getAll(mockRequest,mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith({data:[validObject]})
  });
  describe('createNewUser', () => {
    it('should create a new user and return 200', async () => {
      const mockUser: CreateUserDto = { username: 'username', password: 'strong_password' };
      const mockCreatedUser: UserDto = { ...mockUser, isActive:true,createAt:new Date()};
      jest.spyOn(service, 'createNewUser').mockResolvedValue(mockCreatedUser);

      await controller.createNewUser(mockUser, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockCreatedUser });
    });

    it('should return 400 (Bad Request) for invalid user data', async () => {
      const invalidUser: any = { name: 'johndoe' }; // Missing information

      await controller.createNewUser(invalidUser, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation error',
      });
    });

    it('should return 500 (Internal Server Error) for unexpected errors', async () => {
      const mockUser: CreateUserDto = { username: 'username', password: 'strong_password' };
      jest.spyOn(service, 'createNewUser').mockRejectedValue(new Error());

      await controller.createNewUser(mockUser, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    });

   });
});
