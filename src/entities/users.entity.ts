import { Entity,OneToMany,PrimaryColumn,Column, OneToOne, JoinColumn, BaseEntity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, ManyToMany } from "typeorm"

import { Department } from "./department.entity";
import { Subject } from "./subject.entity";
import { Topic } from "./topic.entity";
import { Event } from "./event.entity";
import { Base } from "./base.entity";
import { Group } from "./group.entity";
import { Optional } from "@nestjs/common";



@Entity()
export class User extends Base {
    @PrimaryColumn()
    googleId?: string

    @Column()
    email: string

    @Column()
    givenName: string

    @Column()
    familyName: string
   
    @Column({ nullable: true})
    major: string

    @Column({ nullable: true})
    skills: string

    @Column({ nullable: true})
    class: string

    @Column({ nullable: true})
    phone: string

    @Column()
    picture: string

    @Column()
    role: string

    @OneToMany(() => Subject, (subject) => subject.idUser)
    subjects: Subject[]

    @OneToMany(() => Subject, (subject) => subject.students)
    studentSub: Subject[]

    @OneToMany(() => Topic, (topic) => topic.createdBy)
    createdByTopics: Topic[]

    @OneToMany(() => Topic, (topic) => topic.idTeacher)
    idTeacherTopics: Topic[]
    
    @OneToMany(() => Group, group => group.users)
    groups: Group[];
   
    @Optional()
    @OneToMany(() => Event, event => event.idUser)
    events: Event[]

    @Optional()
    @OneToOne(() => Department, department => department.owner)
    department: Department;

    
}