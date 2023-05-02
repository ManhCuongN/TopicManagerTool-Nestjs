import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EVENT_CONSTANTS } from 'src/constant/eventConstant';
import { EVENT_TYPE } from 'src/constant/eventType';
import { Group } from 'src/entities/group.entity';
import { EventService } from 'src/event/event.service';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService {
    constructor(@InjectRepository(Group) private groupRepo: Repository<Group>,
                @Inject(EventService) private eventService: EventService) {}

    async create(createGroup, currentUser) {
        const {groupName, idUsers} = createGroup
        try {
            if(idUsers && Array.isArray(idUsers)) {
                idUsers.push(currentUser.googleId)
    
                const group = await this.groupRepo.save({
                    groupName,
                    users: [...new Set(idUsers)]
                })
    
                await this.eventService.createEvent(
                  group.idGroup,
                  currentUser.googleId,
                  EVENT_TYPE.CREATE_EVENT,
                  EVENT_CONSTANTS.CREATE_GROUP
                )
    
                idUsers.forEach(async(idUser) => {
                    if(idUser != currentUser.googleId) {
                        await this.eventService.createEvent(
                            group.idGroup,
                            idUser,
                            EVENT_TYPE.CREATE_EVENT,
                            EVENT_CONSTANTS.INVITE_GROUP
                        )
                    }
                })
            }
        } catch (error) {
            console.log(error);   
        }
    }

    async update(idGroup, updateGroup, currentUser) {
        const {newNameGroup} = updateGroup
        try {
            const newGroup = await this.groupRepo.createQueryBuilder()
                                                 .update(Group)
                                                 .set({groupName: newNameGroup})
                                                 .where("idGroup = :idGroup", {idGroup})
                                                 .returning("*")
                                                 .execute()

            const userOfGroup = await this.groupRepo.createQueryBuilder('group')
           .leftJoinAndSelect('group.users', 'userTable')
           .where('userTable.groupId = :id', { id: idGroup })
           .getOne();

           await this.eventService.createEvent(
                idGroup,
                currentUser.googleId,
                EVENT_TYPE.UPDATE_EVENT,
                EVENT_CONSTANTS.UPDATE_GROUP
            )
            
           userOfGroup.users.forEach(async (user) => {
              if(user.googleId != currentUser.googleId) {
                await this.eventService.createEvent(
                    idGroup,
                    user,
                    EVENT_TYPE.UPDATE_EVENT,
                    `${EVENT_CONSTANTS.UPDATE_GROUP_BY_OTHERS}: ${newGroup.raw[0].groupName}`
                )
              }
              
             
           })
            
        } catch (error) {
            
        }
    }

    async getUserOfGroup(idGroup) {
        try {
            console.log(idGroup);
            
            const userOfGroup = await this.groupRepo.createQueryBuilder('group')
            .leftJoinAndSelect('group.users', 'userTable')
            .where('userTable.groupId = :id', { id: idGroup })
            .getOne();

            return userOfGroup
        } catch (error) {
            
        }
    }
}
