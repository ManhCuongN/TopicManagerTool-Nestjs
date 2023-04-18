import { Inject, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { VerifyCallback } from "jsonwebtoken";
import { Strategy } from "passport-google-oauth20";
import { UsersService } from "../users/users.service";
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(UsersService) private userService: UsersService
  ) {
    super({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        scope: ['profile', 'email']
    })
  }

  async validate (
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    try {
        let newUser
        let googleIdToken;
        let isCreated = false;
         let user = await this.userService.findOneByGoogleId({googleId: profile.id})   
        if(!user) {
            const extension = profile._json.email.split('@')[1];
            const tdtu =
            extension.match('tdt') || extension.match('gmail') || extension.match('vku');
          if (tdtu == null) {
            console.log("failed Mail");
            throw new UnauthorizedException();
          }
          isCreated = true;
            newUser = {
            googleId: profile.id,
            familyName: profile.name.familyName,
            givenName: profile.name.givenName,
            email: profile._json.email,
            picture: profile._json.picture,
            createdAt: new Date(),
            role: 'student',
          }
           await this.userService.createUser(newUser)
           googleIdToken = newUser.googleId
          //await this.subjectService.checkQueue(newUser.email, newUser.googleId)
        } 

        googleIdToken = profile.id

        // else {

        //     if(newUser.picture != profile._json.picture) {
        //         newUser.picture = profile._json.picture;
        //         console.log("kahcs");
                
        //         //await this.userService.createUser(newUser)
        //     } 
        //     newUser = {
        //       googleId: profile.id
        //     }
       // }
        done(null, { googleId: googleIdToken, isCreated });
    } catch (error) {
      console.log("err",error);
        done(error, null)
        
    }
  }
}