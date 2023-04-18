import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from 'src/jwt/jwt.module';

import { TopicService } from './topic.service';
import { TopicsController } from './topics.controller';
import { JwtMiddleware } from 'src/guards/get-user.decorator';
import { Subject } from 'src/entities/subject.entity';
import { Request } from 'src/entities/request.entity';
import { Topic } from 'src/entities/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topic]),JwtModule],
  providers: [TopicService],
  controllers: [TopicsController],
 
})
export class TopicsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(TopicsController);
  }
 
 
}
