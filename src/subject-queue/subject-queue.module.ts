import { Module } from '@nestjs/common';
import { SubjectQueueService } from './subject-queue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectQueue } from 'src/entities/subjectqueue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectQueue])],
  providers: [SubjectQueueService],
  exports: [SubjectQueueService]
})
export class SubjectQueueModule {}
