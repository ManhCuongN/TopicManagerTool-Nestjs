import { BaseEntity, Column, JoinColumn,CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";
import { Base } from "./base.entity";

@Entity()
export class Group extends Base{
    @PrimaryGeneratedColumn()
    idGroup: number

    @Column()
    idUser: string

    @Column()
    groupName: string

    @ManyToMany(() => User,  user => user.groups, { cascade: true })
    @JoinColumn({ name: "users" })
    users: User
}