import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Base } from "./base.entity";



@Entity()
export class SubjectQueue extends Base {
    @PrimaryGeneratedColumn()
    idSubjectQueue: number

    @Column()
    idSubject: number

    @Column()
    email: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    from: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    to: Date

   
}