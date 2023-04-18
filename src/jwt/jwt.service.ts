import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
@Injectable()
export class JwtService {
   
    generateAccessToken(googleId) {
        return sign( {
            role: "student",
            iss: process.env.NAME,
            iat: new Date().getTime(),
            sub: googleId,
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn: "3h"}        
        )
    }

    generateRefreshToken(googleId) {
        return sign({
            role: "student",
            iss: process.env.NAME,
            iat: new Date().getTime(),
            sub: googleId
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn: "3d"}
        )
    } 

    decodeToken(token) {
        return verify(token, process.env.JWT_SECRET_KEY)
    }
}
