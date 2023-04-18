import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EVENT_CONSTANTS } from 'src/constant/eventConstant';
import { EVENT_TYPE } from 'src/constant/eventType';
import { Subject } from 'src/entities/subject.entity';
import { EventService } from 'src/event/event.service';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectService {

    constructor(@InjectRepository(Subject) private subjectRepo: Repository<Subject>,
                 @Inject(EventService) private eventService: EventService) {}

    async findByIdSubject(idSubject) {
         return await this.subjectRepo.findOneBy({
            codeSubject: idSubject
         })
    }

    async create(createSubject, currentUser):Promise<Subject> {
        const {title, limitRequest} = createSubject
        try {
            const subject = new Subject()
              subject.title = title
              subject.limitRequest = limitRequest
              subject.idUser = currentUser.googleId
        const newSubject = await this.subjectRepo.save(subject)
        await this.eventService.createEvent(
            subject.codeSubject,
            currentUser.googleId,
            EVENT_TYPE.CREATE_EVENT,
            `${EVENT_CONSTANTS.CREATE_SUBJECT}: ${subject.title}`
        )
        return newSubject
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            
        }       
    }

    async update(idSubject, updateSubject, currentUser) {
        const {title, from, to, isCloseStatus, limitRequest} = updateSubject
        try {
          await this.subjectRepo.createQueryBuilder()
                         .update(Subject)
                         .set({title, from: new Date(from), to: new Date(to), isCloseStatus,limitRequest})
                         .where("codeSubject = :id", {id: idSubject})
                         .execute()
                        
                         
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            
        }

    }
}
