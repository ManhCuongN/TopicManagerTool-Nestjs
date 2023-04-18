import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/entities/department.entity';
import { DepartmentController } from './department.controller';
import { JwtMiddleware } from 'src/guards/get-user.decorator';
import { EventService } from 'src/event/event.service';
import { EventModule } from 'src/event/event.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, User]), EventModule, JwtModule],
  providers: [DepartmentService, UsersService],
  exports: [DepartmentService],
  controllers: [DepartmentController]
})
export class DepartmentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(DepartmentController);
  }
}
