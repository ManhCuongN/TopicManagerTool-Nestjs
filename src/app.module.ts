import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from 'nestjs-session';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { TopicModule } from './topic/topic.module';
import { config } from './orm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from './jwt/jwt.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SubjectModule } from './subject/subject.module';
import { EventModule } from './event/event.module';
import { DepartmentModule } from './department/department.module';


@Module({

  imports: [
    TypeOrmModule.forRoot(config),
    TopicModule,
    JwtModule,
    UsersModule,
    AuthModule,
    AppModule,
    SubjectModule,
    EventModule,
    DepartmentModule

  ],
})
export class AppModule {
 
}
 