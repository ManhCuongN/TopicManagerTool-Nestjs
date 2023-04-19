import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from 'src/entities/topic.entity';
import { User } from 'src/entities/users.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { JwtMiddleware } from 'src/guards/get-user.decorator';
import { SubjectModule } from 'src/subject/subject.module';
import { Request } from 'src/entities/request.entity';
import { EventModule } from 'src/event/event.module';
import { DepartmentModule } from 'src/department/department.module';
import { UsersService } from 'src/users/users.service';



@Module({
  imports: [TypeOrmModule.forFeature([Topic, User, Request]), JwtModule, SubjectModule, EventModule, DepartmentModule],
  providers: [TopicService, UsersService],
  controllers: [TopicController]
})
export class TopicModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(TopicController);
  }
}
