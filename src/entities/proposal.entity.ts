import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Base } from "./base.entity";


enum Status {
 SENDING
}

@Entity()
export class Proposal extends Base {
    
    @PrimaryGeneratedColumn()
    idProposal: number
     
    @Column()
    idSubject: string

    @Column()
    title: string

    @Column()
    description: string

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.SENDING,
      })
      status: Status;
    
      @Column({default: ""})
      requiredSkills: string

      @Column({default: false})
      ready: Boolean

      @Column({default: false})
      confirm: Boolean

      @Column()
      idTeacher: string

      @Column({default: false})
      plan: string

      @Column()
      createdBy: string

      @Column()
      filter: string

      @Column()
      idGroup: string

      @Column()
      note: string

      @Column()
      scheduledVersion: number

}
