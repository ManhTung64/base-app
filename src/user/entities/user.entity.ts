import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
export enum Role{
    admin = 'admin',
    user = 'user'
}
@Entity({name:'users'}) // name of entity
export class User {

    @PrimaryGeneratedColumn({type:'bigint'})
    id:number

    @Column({unique:true})
    username:string

    @Column()
    password:string

    @Column({default:false})
    isActive:boolean

    @Column({default:new Date()})
    createAt:Date

    @Column({default:Role.user})
    role:Role

    @OneToOne(()=>Profile,profile=>profile.user)
    @JoinColumn()
    profile:Profile
}