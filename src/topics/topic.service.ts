import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from 'src/entities/topic.entity';
import { Repository } from 'typeorm';


@Injectable()
export class TopicService {
   constructor(@InjectRepository(Topic) private topicRepo: Repository<Topic>) {}
   
   async test() {
    const a = await this.topicRepo.find()
    console.log(a);
    
   }
}
