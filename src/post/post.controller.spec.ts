import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostModule } from './post.module';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostContent } from './entities/post.entity';
import { HttpStatus, forwardRef } from '@nestjs/common';
import ormconfig = require('../configuration/typeorm.config')
import { Request, Response } from 'express';

describe('PostController', () => {
  let controller: PostController;
  let postService:PostService
  const mockRequest = {} as unknown as Request
  const mockJson = jest.fn().mockReturnThis()
  const mockRes:Response = {
    status: jest.fn((x)=>({
      json:jest.fn((y)=>mockJson)
    })), // Mock the status method
    json: jest.fn((x)=>x)
  } as unknown as Response;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      imports:[
        TypeOrmModule.forRoot(ormconfig[0]),
        TypeOrmModule.forFeature([PostContent]),
        forwardRef(()=>UserModule)
      ],
      providers: [PostService, PostRepository]
    }).compile();

    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  let mockPosts: PostContent[] = [
    { id: 1, title: 'Post 1', content: 'Content 1',updateAt:new Date(),user:{} as any },
    { id: 2, title: 'Post 2', content: 'Content 2' ,updateAt:new Date(),user:{} as any },
  ];

  describe('getByUser', () => {
    it('should return 200 (OK) with list of posts for valid user ID', async () => {
      const mockUserId = 1;
      jest.spyOn(postService, 'getListPostByUser').mockResolvedValue(mockPosts);

      await controller.getByUser(mockUserId, mockRes);

      expect(postService.getListPostByUser).toHaveBeenCalledWith(mockUserId);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockPosts });
    });

    it('should return 500 when error ', async () => {
      const mockUserId = 99;
      jest.spyOn(postService, 'getListPostByUser').mockRejectedValue(new Error());

      await controller.getByUser(mockUserId, mockRes);

      expect(postService.getListPostByUser).toHaveBeenCalledWith(mockUserId);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    });
  });

  describe('getPost', () => {
    it('should return 200 (OK) with a post for valid ID', async () => {
      const mockPostId = 1;
      jest.spyOn(postService, 'getPost').mockResolvedValue(mockPosts[0]);

      await controller.getPost(mockPostId, mockRes);

      expect(postService.getPost).toHaveBeenCalledWith(mockPostId);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockPosts[0] });
    });

    it('should return 404 (Not Found) for non-existent post ID', async () => {
      const mockPostId = 99;
      jest.spyOn(postService, 'getPost').mockResolvedValue(null);

      await controller.getPost(mockPostId, mockRes);

      expect(postService.getListPostByUser).toHaveBeenCalledWith(mockPostId);
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    });

    // Add more test cases for edge cases and error handling.
  });

  describe('getAll', () => {
    it('should return 200 (OK) with a list of all posts', async () => {
      jest.spyOn(postService, 'getAllPost').mockResolvedValue(mockPosts);

      await controller.getAll(mockRes);

      expect(postService.getAllPost).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
    })
})
})
