import { Column, Entity,ManyToOne, OneToMany, PrimaryColumn, JoinColumn, BaseEntity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";


import { User } from "./users.entity";
import { Request } from "./request.entity";
import { Topic } from "./topic.entity";
import { Base } from "./base.entity";
import { SubjectQueue } from "./subjectqueue.entity";



@Entity()
export class Subject extends Base{
  
    @PrimaryGeneratedColumn()
    codeSubject: number

    @Column()
    title: string
    
    @Column({default: 0})
    totalInvitation?: number

    @Column({default: 0})
    scheduledVersion: number
    

    @Column({default: 0})
    limitRequest: number

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    from: Date

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    to: Date

    @Column({default: false})
    isScheduled: Boolean

    @Column({default: true})
    isCloseStatus: Boolean

    @ManyToOne(() => User, (user) => user.subjects, { cascade: true })
    @JoinColumn({ name: "idUser" })
    idUser: User

    @OneToMany(() => User, (user) => user.codeSubject, { cascade: true })
    students: User[]

    @OneToMany(() => Topic, (topic) => topic.idSubject, { cascade: true })
    topics: Topic[]

    @OneToMany(() => Request, (request) => request.idSubject)
    requests: Request[]

    @OneToMany(() => SubjectQueue, (subQueue) => subQueue.idSubject, {cascade: true})
    subjectqueue: SubjectQueue[]
    

}