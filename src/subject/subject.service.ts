import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { log } from 'console';
import { EVENT_CONSTANTS } from 'src/constant/eventConstant';
import { EVENT_TYPE } from 'src/constant/eventType';
import { STATUS } from 'src/constant/httpCode';
import { Request } from 'src/entities/request.entity';
import { Subject } from 'src/entities/subject.entity';
import { User } from 'src/entities/users.entity';
import { EventService } from 'src/event/event.service';
import { SubjectQueueService } from 'src/subject-queue/subject-queue.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectService {

    constructor(@InjectRepository(Subject) private subjectRepo: Repository<Subject>,
                 @Inject(EventService) private eventService: EventService,
                 @Inject(UsersService) private userService: UsersService,
                 @Inject(SubjectQueueService) private subjectQueueService: SubjectQueueService,
                 @InjectRepository(Request) private requestRepo: Repository<Request>) {}

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

    async getGenaralInfo(idSubject) {
        try {
            if(idSubject && idSubject != "") {
                let data = []
                const requests = await this.requestRepo
                .createQueryBuilder("request")
                .leftJoinAndSelect("request.idTopic", "topic")
                .leftJoinAndSelect("topic.idTeacher", "teacher")
                .leftJoinAndSelect("request.idSubject", "subject")
                .leftJoinAndSelect("request.idGroups", "group")
                .leftJoinAndSelect("group.users", "user")
                .where("request.idSubject = :idSubject", { idSubject: idSubject })
                .andWhere("request.status = :status", { status: STATUS.APPROVED })
                .getMany();
               
                if(requests != null) {
                    let index = 1;
                    const listUser = await this.userService.findAll();
                                     
                    requests.forEach((ele) => {
                    const object = {}
                    object['STT'] = index;
                    object["Mã đề tài"] = ele.idTopic.code;
                    object["Tên đề tài"] = ele.idTopic.title;
                    object["Đợt đăng kí"] = ele.scheduledVersion;
                    object["Ghi chú"] = ele.note;
                    object["Mã đề tài"] = ele.idTopic.code;
                    let teacherNames = [];

                    for (let i = 0; i < listUser.length; i++) {
                      if (listUser[i]['googleId'] === ele.idTopic.idTeacher.googleId) {
                        const givenName = listUser[i]['givenName'];
                        const familyName = listUser[i]['familyName'];
                        const teacherName = `${givenName} ${familyName}`;
                        teacherNames.push(teacherName);
                        
                      }
                    }
                    object["Giảng viên"] = teacherNames;
                    const students = ele.idGroups.users;
                    for (let i = 0; i < students.length; i++) {
                        const name = `Họ và tên sinh viên ${i + 1}`;
                        const mssv = `MSSV (SV ${i + 1})`;
                        object[name] = `${students[i].givenName}  ${students[i].familyName} `;
                        object[mssv] = students[i].email.split("@")[0];
                      }
                    data.push(object);
                    index++;
                   }) 
                }  
                return data;           
            } else {
                throw new HttpException('Request Not Found', HttpStatus.BAD_REQUEST);
            }
          
        } catch (error) {
            console.log(error);
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createSchelude(id, createSchBody, currentUser) {
        const {from, to, idUsers, emails} = createSchBody;
        try {
            await this.subjectRepo.createQueryBuilder()
            .update(Subject)
            .set({
              from : new Date(from),
              to: new Date(to),
              students: idUsers,
              isScheduled: true
            })
            .where("codeSubject = :id", {id})
            .execute()

        const subject = await this.subjectRepo.findOne({
              where: { codeSubject: id },
              relations: ['students'],
            });
            
        const emailStudent = subject.students.map((student) => student.email)


        let numQueue = 0; 
        for (let i = 0; i < emails.length; i++) {
        const user = await this.userService.findByEmail(emails[i])

        if(user) {
           
            
          if(emailStudent.indexOf(user.email) == -1) {
             subject.students.push(user)
             } else {            
                    numQueue++;
                    const newSubjectQueue = {
                        idSubject: id,
                        email: emails[i].toLowerCase(),
                        from: new Date(from),
                        to: new Date(to),
                    }
                 await this.subjectQueueService.createSubjectQueue(newSubjectQueue)
    
            } 
        } 
}
         subject.totalInvitation = subject.students.length + numQueue; 
         await this.subjectRepo.save({ id, totalInvitation: subject.totalInvitation });      
         
         await this.eventService.createEvent(
            id,
            currentUser.googleId,
            EVENT_TYPE.CREATE_EVENT,
            `${EVENT_CONSTANTS.CREATE_SCHEDULE} (${subject.title})`
         )

         subject.students.forEach(async(ele) => {
            await this.eventService.createEvent(
                id,
                ele.googleId,
                EVENT_TYPE.CREATE_EVENT,
                `${EVENT_CONSTANTS.INVITE_SUBJECT} (${subject.title})`
            )
         })
    
        } catch (error) {
            
        }                                         
    }

    async addStudentsToSubject(idSubject, body, currentUser, next) {
        try {
            const {idUsers} = body
            
           // const subject =  await this.subjectRepo.findOneBy({codeSubject: idSubject})
           const subject = await this.subjectRepo.createQueryBuilder('subject')
           .leftJoinAndSelect('subject.students', 'students')
           .where('subject.codeSubject = :id', { id: idSubject })
           .getOne();
                      
        //    return
        for (const index in idUsers) {
            const googleId = idUsers[index];
            const user = await this.userService.findOne({googleId});         
            subject.students.push(user);
          }
            
        
            subject.totalInvitation += idUsers.length;
           
           
            
            await this.subjectRepo.save(subject);
            await this.eventService.createEvent(
                idSubject,
                currentUser.googleId,
                EVENT_TYPE.UPDATE_EVENT,
                `${EVENT_CONSTANTS.UPDATE_SUBJECT} (${subject.title})`
            )

            idUsers.forEach(async (idUser) => {
                await this.eventService.createEvent(
                    idSubject,
                    idUser,
                    EVENT_TYPE.UPDATE_EVENT,
                    `${EVENT_CONSTANTS.UPDATE_SUBJECT} (${subject.title})`
                )
            })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}
