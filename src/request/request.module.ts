import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'src/entities/request.entity';
import { User } from 'src/entities/users.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { EventModule } from 'src/event/event.module';
import { TopicModule } from 'src/topic/topic.module';
import { GroupModule } from 'src/group/group.module';
import { Topic } from 'src/entities/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request, User, Topic]), JwtModule, EventModule, TopicModule, GroupModule],
  providers: [RequestService],
  controllers: [RequestController]
})
export class RequestModule {}
