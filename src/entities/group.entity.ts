import { BaseEntity, Column, JoinColumn,CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";
import { Base } from "./base.entity";
import { Request } from "./request.entity";

@Entity()
export class Group extends Base{
    @PrimaryGeneratedColumn()
    idGroup: number

    @Column()
    groupName: string

    @OneToMany(() => User, (user) => user.group)
    users: User[];

    @OneToMany(() => Request, (request) => request.idGroups)
    requests: Request[]  

    
}