import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Base } from "./base.entity";
import { Subject } from "./subject.entity";



@Entity()
export class SubjectQueue extends Base {
    @PrimaryGeneratedColumn()
    idSubjectQueue: number

    @ManyToOne(() => Subject, (subject) => subject.subjectqueue)
    @JoinColumn({ name: "idSubject" })
    idSubject: Subject

    @Column()
    email: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    from: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    to: Date

   
}