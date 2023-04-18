import { Module } from '@nestjs/common';
import { JwtModule } from '../jwt/jwt.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [JwtModule],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
