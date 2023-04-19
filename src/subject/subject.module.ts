import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from 'src/entities/subject.entity';
import { EventModule } from 'src/event/event.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersService } from 'src/users/users.service';
import { JwtMiddleware } from 'src/guards/get-user.decorator';
import { User } from 'src/entities/users.entity';
import { Request } from 'src/entities/request.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, User, Request]), EventModule, JwtModule, UsersModule],
  providers: [SubjectService, UsersService],
  controllers: [SubjectController],
  exports: [SubjectService]
})
export class SubjectModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(SubjectController);
  }
}
