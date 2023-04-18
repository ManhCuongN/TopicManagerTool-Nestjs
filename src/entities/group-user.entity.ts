import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";
import { Base } from "./base.entity";
import { Group } from "./group.entity";

@Entity()
export class GroupsUsers extends Base{
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    userId: number;
  
    @Column()
    groupId: number;
  
    @ManyToOne(() => User, user => user.groups)
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @ManyToOne(() => Group, group => group.users)
    @JoinColumn({ name: 'groupId' })
    group: Group;

}