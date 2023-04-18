import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, JoinColumn, BaseEntity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "./department.entity";
import { Subject } from "./subject.entity";
import { User } from "./users.entity";
import { Request } from "./request.entity";
import { Base } from "./base.entity";


@Entity('topic')
export class Topic extends Base {
    @PrimaryGeneratedColumn()
    idTopic: number
    
    @Column()
    title: string

    @Column({default:""})
    requiredSkills: string

    @Column({default:""})
    description: string

    @Column({default:""})
    deanNote: string

    @Column({default:""})
    hdNote:string

    @Column({default: false})
    ready: Boolean

    @Column({default:false})
    confirm: Boolean

    @Column({default: 0})
    numRequest: number

    @Column({default: 0})
    numRegisters: number

    @Column({default: 0})
    numMembers: number

    @Column()
    limit: number

    @Column()
    code: String

    @ManyToOne(() => Subject, (subject)=> subject.topics)
    @JoinColumn({ name: "idSubject" })
    idSubject: Subject

    @ManyToOne(() => User, (user) => user.createdByTopics, { cascade: true })
    @JoinColumn({ name: "createdBy" })
    createdBy: User

    @ManyToOne(() => User, (user) => user.idTeacherTopics, { cascade: true })
    @JoinColumn({ name: "idTeacher" })
    idTeacher: User

    @ManyToOne(() => Department, (department) => department.topics, { cascade: true })
    @JoinColumn({ name: "filter" })
    filter: Department

    @OneToMany(() => Request, (request) => request.idTopic)
    request: Request[]

}