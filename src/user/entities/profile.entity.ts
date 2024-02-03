import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name:'profile'})
export class Profile{
    @PrimaryGeneratedColumn({type:'bigint'})
    id:number

    @Column("varchar")
    name:string

    @Column({nullable:true})
    dob:Date

    @Column({nullable:true})
    phonenumber:string
    
    @CreateDateColumn()
    @UpdateDateColumn()
    updateAt:Date

    @OneToOne(()=>User,user=>user.id)
    @JoinColumn()
    user:User
}