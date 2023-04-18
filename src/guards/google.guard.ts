import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '../jwt/jwt.service';
import { ROLES_KEY } from './role.decorator';
interface MyJwtPayload {
    role: string;
    iss: string;
    iat: number;
    sub: string;
    exp: number;
  }
@Injectable()
export class RolesGuard implements CanActivate {
    
  constructor(private reflector: Reflector,
              @Inject(JwtService) private jwtService: JwtService ) {}
  
  canActivate(context: ExecutionContext,) {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    if (!roles) {
        console.log("not roles");
        
      return true;
    } 
    
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization.split(' ')[1];
    // const session = request.session.token;
     const decodedToken =   this.jwtService.decodeToken(authHeader) as MyJwtPayload

     const userRole = decodedToken.role;
    
    // lấy giá trị token từ session
     return roles.includes(userRole);
  }
}
