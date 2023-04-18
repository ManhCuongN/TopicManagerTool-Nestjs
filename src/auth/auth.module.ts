import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { UsersModule } from 'src/users/users.module';



@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    PassportModule.register({
      defaultStrategy: 'google',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule, 
  ],
  exports: [JwtStrategy, GoogleStrategy],
  providers: [AuthService, JwtStrategy, GoogleStrategy]
})
export class AuthModule {}
//@UseGuards(AuthGuard('jwt'))
