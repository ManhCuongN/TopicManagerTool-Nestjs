import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { STATUS } from "../constant/httpCode";
import { Base } from "./base.entity";
import { User } from "./users.entity";

@Entity()
export class Event extends Base{
    
    @PrimaryGeneratedColumn()
    eventId: number
     
    @Column()
    objectId: string
    
    @Column()
    eventType: string

    @Column()
    description: string

    @Column({
        type: 'enum',
        enum: STATUS,
        default: STATUS.SENDING,
      })
      status: STATUS;


      @ManyToOne(() => User, user => user.events)
      @JoinColumn({name: "idUser"})
      idUser: User;
   
}