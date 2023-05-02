import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { OVER_REGISTER_MESSAGE } from 'src/constant/errorConstant';
import { EVENT_CONSTANTS } from 'src/constant/eventConstant';
import { EVENT_TYPE } from 'src/constant/eventType';
import { STATUS } from 'src/constant/httpCode';
import { Request } from 'src/entities/request.entity';
import { Topic } from 'src/entities/topic.entity';
import { EventService } from 'src/event/event.service';
import { GroupService } from 'src/group/group.service';
import { TopicService } from 'src/topic/topic.service';
import { Repository } from 'typeorm';

@Injectable()
export class RequestService {

    constructor(@InjectRepository(Request) private requestRepo: Repository<Request>,
                @InjectRepository(Topic) private topicRepo: Repository<Topic>,
                @Inject(TopicService) private topicService: TopicService,
                @Inject(GroupService) private groupService: GroupService,
                @Inject(EventService) private eventService: EventService) {}

    async create(idTopic, createRequest) {
        const {idGroup, plan} = createRequest
        let error: any[] = [];
        try {
            let topic = await this.topicService.findOneByIdTopic(idTopic)
            let subject = await this.topicService.findSubjectFollowIdTopic(idTopic)
            const requests = await this.requestRepo.count({ where: { idTopic } });
            
            if(topic && (requests < topic.numRequest)) {
                let request = new Request();
                request.idTopic = topic;
                request.idSubject = subject;
                request.idGroups = idGroup;
                request.scheduledVersion = subject.scheduledVersion;
                request.plan = plan;

                await this.requestRepo.save(request);
            } else {
                error.push({ topic: topic.title, ...OVER_REGISTER_MESSAGE });
              }

            const group = await this.groupService.getUserOfGroup(idGroup)
            group.users.forEach(async(user) => {
                await this.eventService.createEvent(
                    user.googleId,
                    user.googleId,
                    EVENT_TYPE.CREATE_EVENT,
                    EVENT_CONSTANTS.REGISTER_TOPIC
                )
            })
            
            
        } catch (error) {
            console.log(error);
            
        }
    }

    async updateStatusRequest(idRequest, updateRequest) {
          const {status, note} = updateRequest
          try {    
            const subject = await this.requestRepo.createQueryBuilder("request")
            .leftJoinAndSelect("request.idSubject", "subject")
            .where("request.codeRequest = :id", {id: idRequest})
            .getOne()

            const group = await this.requestRepo.createQueryBuilder("request")
            .leftJoinAndSelect("request.idGroups", "group")
            .where("request.codeRequest = :id", {id: idRequest})
            .getOne()
                       
            const requests =  await this.requestRepo.createQueryBuilder('request')
            .where('request.idSubject = :idSubject', { idSubject: subject.idSubject.codeSubject })
            .andWhere('request.idGroups = :idGroups', { idGroups: group.idGroups.idGroup })
            .getMany();

            const idUserOfGroup = await this.groupService.getUserOfGroup(group.idGroups.idGroup)
            
            if(idRequest && status && note && note.trim() != "") {
                const request = await this.requestRepo.findOneByOrFail({codeRequest: idRequest})
                
                if(status == STATUS.APPROVED) {
                    const topic = await this.topicService.getTopicFollowIdRequest(idRequest)

                    if(topic.numRegisters >= topic.limit) {
                        throw OVER_REGISTER_MESSAGE
                    }
                    topic.numRegisters += 1       
                    
                    if(topic.numRegisters == topic.limit) {
                        const closeRequests = await this.requestRepo.createQueryBuilder("request")
                                                                    .where("request.idTopic = :id", { id: topic.idTopic })
                                                                    .andWhere("request.status = :status", {status: STATUS.SENDING})
                                                                    .getMany()
                         closeRequests.forEach((ele) => {
                         ele.status = STATUS.REJECTED;
                         ele.note = "Đề tài đã đủ số lượng nhóm đăng ký";
                         ele.save();
                         });
                    }

                    await this.topicRepo.save(topic)
                    requests.forEach((request) => {
                        if (request.codeRequest != idRequest) {
                            request.status = STATUS.REJECTED;
                            request.note = "Đã đăng ký thành công một đề tài khác";
                            request.save();
                          }
                    })
                    
                    idUserOfGroup.users.forEach(async(user) => {
                        await this.eventService.createEvent(
                            idRequest,
                            user.googleId,
                            EVENT_TYPE.UPDATE_EVENT,
                            EVENT_CONSTANTS.APPROVE_REQUEST
                        )
                    })
                } else if(status == STATUS.REJECTED) {
                    idUserOfGroup.users.forEach(async(user) => {
                        await this.eventService.createEvent(
                            idRequest,
                            user.googleId,
                            EVENT_TYPE.UPDATE_EVENT,
                            EVENT_CONSTANTS.REJECT_REQUEST
                        )
                    })
                }
                await this.requestRepo.createQueryBuilder()
                                      .update(Request)
                                      .set({status, note})
                                      .where("codeRequest = :id", {id:idRequest})
                                      .execute()             
            }
          } catch (error) {
            console.log(error);
          }
    }

    async updateNoteRequest(idRequest, body) {
        const {note} = body
        try {
            await this.requestRepo.createQueryBuilder()
                                  .update(Request)
                                  .set({note})
                                  .where("codeRequest = :idRequest", {idRequest})
                                  .execute()
        } catch (error) {
            console.log(error);
            
        }
    }
}
