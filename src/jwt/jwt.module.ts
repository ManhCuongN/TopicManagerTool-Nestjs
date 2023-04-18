import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';


@Module({
  providers: [JwtService],
  controllers: [],
  exports: [JwtService]
})
export class JwtModule {}
