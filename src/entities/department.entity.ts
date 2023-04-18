import { Column, OneToOne, JoinColumn, Entity, ManyToMany, OneToMany, PrimaryColumn, BaseEntity, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";
import { Topic } from "./topic.entity";
import { Base } from "./base.entity";



@Entity()
export class Department extends Base {
    @PrimaryGeneratedColumn()
    idDepartment: number

    @Column()
    title: string

    @OneToMany(() => Topic, (topic) => topic.filter)
    @JoinColumn({ name: "topics" })
    topics: Topic[]

    @OneToOne(() => User, { cascade: true })
    @JoinColumn({name: "owner"})
    owner: User

}