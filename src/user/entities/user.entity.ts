import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

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

    @OneToOne(()=>Profile,profile=>profile.user)
    @JoinColumn()
    profile:Profile
}