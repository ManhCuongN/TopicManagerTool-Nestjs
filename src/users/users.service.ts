import { Inject, Injectable, HttpException, HttpStatus, Res, Req, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { type } from 'os';
import { User } from '../entities/users.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
    constructor(@Inject(JwtService) private  jwtService: JwtService,
                @InjectRepository(User) private userRepo: Repository<User>,
               ) {}

               
               async findOneByGoogleId({googleId}): Promise<boolean> {
                try {
                  const user = await this.userRepo.query(`SELECT * FROM public.user WHERE "googleId" = '${googleId}'`);               
                  return user.length > 0
                } catch (error) {
                  console.error(error);
                  throw new InternalServerErrorException('Error when fetching user by googleId');
                }
              }

              async findOne(googleId) {
                try {
                 
                   const user =  await this.userRepo.findOneByOrFail(googleId);
                 
                   
                   return user;
                   

                } catch (error) {
                    console.log(error);
                    
                  throw new InternalServerErrorException('Error when fetching user by googleId');
                  
                }
              }
              
              async findAll() {
                try {
                  return await this.userRepo.find()
                } catch (error) {
                  throw new InternalServerErrorException('Error when fetching user by googleId');
                  
                }
              }

              async findByEmail(email: string): Promise<User> {
                const lowerEmail = email.toLowerCase();
                return this.userRepo.findOne({
                  where: { email: lowerEmail }
                });
              }
              
              async findStudentsByIdSubject(id: number): Promise<User[]> {
                return this.userRepo.createQueryBuilder('user')
                  .leftJoin('user.studentSub', 'subject')
                  .where('subject.codeSubject = :id', { id })
                  .getMany();
              }
              


    
    //google authenticationTypeError: emails is not iterable
    async googleAuthentication(params) {
      try {
        const {googleId, isCreated} = params
        const accessToken = this.jwtService.generateAccessToken(googleId)
        const refreshToken = this.jwtService.generateRefreshToken(googleId)
        return {
          accessToken,
          refreshToken,
          isCreated
        }
      } catch (error) {
        throw error
      }
      

      
      
    }

   

    async createUser(newUser) {
      await this.userRepo
    .createQueryBuilder()
    .insert()
    .into(User)
    .values(newUser)
    .execute()
    }
}
