import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventService {

    constructor(
        @InjectRepository(Event) private eventRepo: Repository<Event>
    ) {}

    async createEvent(objectId, userId, eventType, description) {
       const newEvent = new Event()
       newEvent.objectId = objectId;
       newEvent.idUser = userId;
       newEvent.eventType = eventType;
       newEvent.description = description
       return await this.eventRepo.save(newEvent)
    }
}
