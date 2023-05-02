import { Body, Controller, Get, Post, Req, Res, UseGuards, Next, Session, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NextFunction, Response } from 'express';
import { Role } from 'src/constant/roleCode';
// import { RolesGuard } from 'src/guards/google.guard';
import { Roles } from 'src/guards/role.decorator';
import {
    HTTP_OK_STATUS,
    HTTP_CREATED_STATUS,
  } from '../constant/httpCode';
import {UsersService} from './users.service'
import { RolesGuard } from 'src/guards/google.guard';

@Controller()
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    googleLogin() {}

    @Get('auth/google/callback')
    @UseGuards(AuthGuard('google'))
    async callback(@Req() req, @Res() res, @Next() next: NextFunction) { 
       try {
       const result = await this.usersService.googleAuthentication(req.user)
       return res
       .setHeader('Authorization', `Bearer ${result.accessToken}`)
       .status(result.isCreated ? HTTP_CREATED_STATUS : HTTP_OK_STATUS)
       .json({access_token: result.accessToken, refresh_token: result.refreshToken}) 
       } catch (error) {
         next(error)
       }  
         
    }
   
    @Get('/add/role')
    @UseGuards(RolesGuard)
    @Roles(Role.ROLE_ADMIN)
    async addRole(@Param("id") idUser: string, @Body() role: string, @Res() res, @Next() next) {
      try {
        await this.usersService.addRole(idUser, role)
        return res.status(200).json({message: "Add Role New Successfully"})
      } catch (error) {
        console.log(error);
        next(error)
      }
    }
  
}
