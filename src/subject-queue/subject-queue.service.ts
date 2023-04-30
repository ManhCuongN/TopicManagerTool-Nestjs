import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectQueue } from 'src/entities/subjectqueue.entity';

@Injectable()
export class SubjectQueueService {
    constructor(@InjectRepository(SubjectQueue) private subjectQueueRepo: SubjectQueue) {}


    async createSubjectQueue(newSubjectQueue) {
          const {idSubject, from, to, email} = newSubjectQueue
          try {
            await this.subjectQueueRepo.save(newSubjectQueue)
          } catch (error) {
            console.log(error);
            
          }
    }
}
