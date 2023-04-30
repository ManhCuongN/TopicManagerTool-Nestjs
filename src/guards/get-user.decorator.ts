import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { In } from 'typeorm';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(UsersService) private userService: UsersService
    ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = this.jwtService.decodeToken(token);
        
        
        const user = await this.userService.findOne({googleId: decoded.sub}) 
        
        
        req['user'] = user; // thêm thông tin user vào request
      } catch (error) {
        // Xử lý lỗi khi token không hợp lệ
      }
    }
    next();
  }
}
