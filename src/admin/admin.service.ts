import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class AdminService {
    
    constructor(
        @Inject(JwtService) private jwtService: JwtService
    ) {}


    async login(body):Promise<{access_token:string ,refresh_token:string}> {
        let {adminId} = body
        if(adminId == process.env.ADMIN) {
          try {
           const accessToken = this.jwtService.generateAccessToken("admin");
           const refreshToken = this.jwtService.generateRefreshToken("admin");
           return {access_token: accessToken, refresh_token: refreshToken}
          } catch (error) {
           throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
          }
        } else {
         throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }
       }
}
