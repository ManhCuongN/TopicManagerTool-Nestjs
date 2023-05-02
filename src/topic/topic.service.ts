import generate from '@babel/generator';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EVENT_CONSTANTS } from 'src/constant/eventConstant';
import { EVENT_TYPE } from 'src/constant/eventType';
import { STATUS } from 'src/constant/httpCode';
import { Role } from 'src/constant/roleCode';
import { DepartmentService } from 'src/department/department.service';
import { Department } from 'src/entities/department.entity';

import { Request } from 'src/entities/request.entity';
import { Subject } from 'src/entities/subject.entity';
import { Topic } from 'src/entities/topic.entity';
import { User } from 'src/entities/users.entity';
import { EventService } from 'src/event/event.service';
import { SubjectService } from 'src/subject/subject.service';

import { Repository } from 'typeorm';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic) private topicRepo: Repository<Topic>,
        @InjectRepository(User) private userRepo: Repository<User>,
        @Inject(SubjectService) private subjectService: SubjectService,
        @InjectRepository(Request) private requestRepo:  Repository<Request>,
        @Inject(EventService) private eventService: EventService,
        @Inject(DepartmentService) private departmentService: DepartmentService,


    ) {}

    async create(topic, currentUser) {
      try {
        const {
            idSubject,
            title,
            description,
            filter,
            limit,
            numRequests,
            numMembers,
            requiredSkills,
            idGroup,
          } = topic;
        
        const createdby = currentUser.googleId;
        let ready = false;
        let confirm = false;
        if(currentUser.role == Role.ROLE_DEAN) {
            ready = true
            confirm = true
        } else if (currentUser.role == Role.ROLE_HD) {
            ready = true
        }

        const code = await this.generateCode(idSubject)
        const newTopic = new Topic;
        newTopic.idSubject = idSubject;
        newTopic.title = title;
        newTopic.numRequest = numRequests;
        newTopic.numMembers = numMembers;
        newTopic.ready = ready;
        newTopic.confirm = confirm;
        newTopic.description = description
        newTopic.filter = filter;
        newTopic.limit = limit;
        newTopic.requiredSkills = requiredSkills;
        newTopic.code = code;
        newTopic.createdBy = createdby;
        newTopic.idTeacher = currentUser.googleId;
        await this.topicRepo.save(newTopic)

        if(idGroup !== "") {
           this.topicRepo.createQueryBuilder()
                         .update(Topic)
                         .set({limit: newTopic.limit + 1,
                                numRegisters: newTopic.numRegisters + 1 })
                         .where("idTopic = :id", {id: newTopic.idTopic})
                         .execute()
          const subject = await this.subjectService.findByIdSubject(newTopic.idSubject);
          let request = new Request()
          request.idTopic = newTopic
          request.idGroups = idGroup;
          request.scheduledVersion = subject.scheduledVersion;
          request.plan = "";
          request.status = STATUS.APPROVED
          await this.requestRepo.save(request)
        }
        
        await this.eventService.createEvent(
          currentUser.googleId,
          currentUser.googleId,
          EVENT_TYPE.CREATE_EVENT,
          `${EVENT_CONSTANTS.CREATE_TOPIC} ${newTopic.title}`
        )
        
        const department = await this.departmentService.findByIdDepartment(filter)

        if(department && department.owner && !ready && !confirm) {
          const hd = await this.userRepo.createQueryBuilder('user')
          .leftJoinAndSelect('user.department', 'department')
          .where('user.googleId = :userId', { userId: department.owner })
          .getOne();
      
          if(hd) {
              await this.eventService.createEvent (
                hd.googleId,
                hd.googleId,
                EVENT_TYPE.CREATE_EVENT,
                `${currentUser.familyName} ${currentUser.givenName} đã tạo một đề tài mới: (${newTopic.title})`
              )
          }

        }

        if (!confirm) {
          const dean = await this.userRepo.findOneBy({ role: Role.ROLE_DEAN });
          if (dean) {
            await this.eventService.createEvent(
              dean.googleId,
              dean.googleId,
              EVENT_TYPE.CREATE_EVENT,
              `${currentUser.familyName} ${currentUser.givenName}  đã tạo một đề tài mới: (${newTopic.title})`
            );
          }
        }
         return newTopic;
                 
          
      } catch (error) {
        console.log(error);
        
      }
    }


    //Update Topic
    async update(id, updateTopic): Promise<Topic> {
      try {
         await this.topicRepo.createQueryBuilder()
        .update(Topic)
        .set(updateTopic)
        .where("idTopic = :id", {id})
        .execute()

        const updatedTopic = await this.topicRepo.findOneByOrFail({ idTopic: id });
        

        return updatedTopic;
        
      } catch (error) {
        console.log(error);
        
      }
    }


    //Update Status
    async updateStatus(id, status, currentUser): Promise<Topic> {
      try {
        let message = "";
        const topic = await this.topicRepo.findOneBy({idTopic: id});
        const user = await this.userRepo.findOneBy({googleId: currentUser.googleId})
        if(currentUser.role == Role.ROLE_DEAN) {
          topic.confirm = status;
          if(status == true) {
            message = `Trưởng khoa ${user.givenName} ${user.familyName} đã duyệt đề tài (${topic.title})`;
          }
          await this.eventService.createEvent(
            topic.idTeacher,
            topic.idTeacher,
            EVENT_TYPE.UPDATE_EVENT,
            message
          )
        } else if (currentUser.role == Role.ROLE_HD) {
          topic.ready = status;
          const userRole = await this.userRepo.findOneBy({role: Role.ROLE_DEAN})
          if(userRole) {
            if(status == true) {
              message = `Trưởng bộ môn ${user.givenName} ${user.familyName} đã duyệt đề tài (${topic.title})`;
            }
            await this.eventService.createEvent(
              userRole.googleId,
              userRole.googleId,
              EVENT_TYPE.UPDATE_EVENT,
              message

            )
          }
        }
        await this.eventService.createEvent(
          id, 
          currentUser.googleId,
          EVENT_TYPE.UPDATE_EVENT,
          EVENT_CONSTANTS.ADD_NOTE
        )

       return await this.topicRepo.save(topic)
         
      } catch (error) {
        console.log(error);
        
      }
    }

    //Add Note for Topic
    async addNote(id,note, currentUser) {
      
      const topic = await this.topicRepo.findOneBy(id)
      if(currentUser.role == Role.ROLE_DEAN) {
        topic.deanNote = note
        await this.eventService.createEvent(
          topic.idTeacher, topic.idTeacher,
          EVENT_TYPE.UPDATE_EVENT,
          `${currentUser.familyName} ${currentUser.givenName}  da them ghi chu vao ${topic.title}`
        ) 
      } else if (currentUser.role == Role.ROLE_HD) {
        topic.hdNote = note
        await this.eventService.createEvent(
          topic.idTeacher,
          topic.idTeacher,
          EVENT_TYPE.UPDATE_EVENT,
          `${currentUser.familyName} ${currentUser.givenName}  da them ghi chu vao ${topic.title}`
        )
      }
      
     const saveTopic = await this.topicRepo.save(topic)
     await this.eventService.createEvent(
      id,
      currentUser.googleId,
      EVENT_TYPE.UPDATE_EVENT,
      EVENT_CONSTANTS.ADD_NOTE
    )     
    return saveTopic
     
    }
    
    
    async generateCode(idSubject) {
        const subject = await this.subjectService.findByIdSubject(idSubject)
        let index = 1;
        const topic = await this.topicRepo
             .createQueryBuilder('topic')
             .where('topic.idSubject = :idSubject', {idSubject})
             .orderBy('topic.created_at', 'DESC')
             .getOne()
        if(topic) {
            const code = topic.code
            index = Number(code.split(".")[1]) + 1;
        }
        if(subject) {
            const titles = subject.title.split(/\s+/);
            return `${titles[0].charAt(0).toUpperCase()}${titles[titles.length - 1]
                .charAt(0)
                .toUpperCase()}.${index}`;
        } else {
            return "None";
          }
    }
    

    async findOneByIdTopic(idTopic): Promise<Topic> {
      return await this.topicRepo.findOneByOrFail({idTopic})
    }

    async findSubjectFollowIdTopic(idTopic) {
      try {
        const result =  await this.topicRepo.createQueryBuilder("topic")
        .leftJoinAndSelect("topic.idSubject", "subject")
        .where("topic.idTopic = :id", { id: idTopic })
        .getOne();

        return result.idSubject
      } catch (error) {
        
      }
    }

    async getTopicFollowIdRequest(id) {
        try {
          return await this.topicRepo.createQueryBuilder("topic")
                                     .leftJoinAndSelect("topic.request", 'request')
                                     .where("request.codeRequest = :id", {id})
                                     .getOne()

        } catch (error) {
          
        }
    }
}
