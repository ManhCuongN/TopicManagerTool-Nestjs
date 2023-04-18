import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";


import { Subject } from "./subject.entity";
import {STATUS} from "../constant/httpCode"
import { Topic } from "./topic.entity";
import { Base } from "./base.entity";


@Entity()
export class Request extends Base {
    
    @PrimaryGeneratedColumn()
    codeRequest: number
     
    @Column()
    idGroup: number

    @Column({
        type: 'enum',
        enum: STATUS,
        default: STATUS.SENDING,
      })
      status: STATUS;
    
      @Column()
      plan: string

      @Column({default: ""})
      note: string

      @Column()
      scheduledVersion: number

      @ManyToOne(() => Topic, (topic) => topic.request, { cascade: true })
      @JoinColumn({ name: "idTopic" })
      idTopic: Topic

     
    
}
