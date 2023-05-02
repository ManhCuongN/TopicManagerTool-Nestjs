import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/entities/group.entity';
import { JwtModule } from 'src/jwt/jwt.module';
import { JwtMiddleware } from 'src/guards/get-user.decorator';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entities/users.entity';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User]), JwtModule, EventModule],
  providers: [GroupService, UsersService],
  controllers: [GroupController],
  exports: [GroupModule, GroupService]
})
export class GroupModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(GroupController);
  }
}
