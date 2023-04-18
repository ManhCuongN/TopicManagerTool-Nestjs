import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EVENT_CONSTANTS } from 'src/constant/eventConstant';
import { EVENT_TYPE } from 'src/constant/eventType';
import { Department } from 'src/entities/department.entity';
import { EventService } from 'src/event/event.service';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentService {

    constructor(
        @InjectRepository(Department) private departmentRepo: Repository<Department>,
        @Inject(EventService) private eventService: EventService
    ) {}

    
    async create(createDep, currentUser) {
        const department = new Department()
              department.title = createDep.title
        await this.departmentRepo.save(department)
        await this.eventService.createEvent(
            department.idDepartment,
            currentUser.googleId,
            EVENT_TYPE.CREATE_EVENT,
           `${EVENT_CONSTANTS.CREATE_DEPARTMENT}: ${department.title}`
        )
        
    }

    async update(id,body, currentUser) {
        const {owner, title} = body
        if(owner !== "") {
            await this.departmentRepo.createQueryBuilder()
                      .update(Department)
                      .set({owner,title})
                      .where("idDepartment = :id", {id})
                      .execute()
        }  else {
            await this.departmentRepo.createQueryBuilder()
                  .update(Department)
                  .set({title})
                  .where("idDepartment = :id",{id})
                  .execute()
        }    
        
        await this.eventService.createEvent(
            id,
            currentUser.googleId,
            EVENT_TYPE.UPDATE_EVENT,
            `${EVENT_CONSTANTS.UPDATE_DEPARTMENT}: ${title}`
        )
    }

   

    async  findByIdDepartment(idDepartment) {
        return await this.departmentRepo.findOneBy({
            idDepartment
        })
    }
}
