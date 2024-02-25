import { Profile } from "../../user/entities/profile.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('post')
export class PostContent{
    @PrimaryGeneratedColumn('uuid')
    id: number
    
    @Column()
    title:string

    @Column()
    content:string

    @Column({nullable:true, type:'jsonb'})
    files:FileInfo[]

    @CreateDateColumn()
    @UpdateDateColumn()
    updateAt:Date

    @ManyToOne(() => Profile,profile=>profile.id, { cascade: true })
    @JoinColumn()
    user: Profile;
}
export interface FileInfo {
    type: string
    url: string
    no:number
  }