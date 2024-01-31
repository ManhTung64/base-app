import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name:'profile'})
export class Profile{
    @PrimaryGeneratedColumn({type:'bigint'})
    id:number

    @Column()
    name:string

    @Column({nullable:true})
    dob:Date

    @Column({nullable:true})
    phonenumber:string

    @OneToOne(()=>User,user=>user.id)
    @JoinColumn()
    user:User
}