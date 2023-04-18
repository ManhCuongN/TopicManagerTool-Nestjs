import { Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { JwtPayload } from "jsonwebtoken";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

export class JwtStrategy extends PassportStrategy(Strategy) {
        
    constructor(
        @Inject(UsersService) private usersService: UsersService
    ) {
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY 
        })
    }
  //END CONSTRUCTOR

//   async validate(payload:JwtPayload) {
//     let user = null;
//     if(payload.sub == 'admin') {
//         user = await this.usersService.findOne({googleId: 'admin'})
//     } else {
//         user = await this.usersService.findOne({googleId: payload.sub})
//     }
//     return user;
//   }


 
    //END 
}