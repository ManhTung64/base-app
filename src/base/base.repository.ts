import { Repository } from "typeorm"

export class BaseRepository<T>{

    constructor( private repository:Repository<T>){
        
    }
    
    public async findAll():Promise<T[]>{
        try{
            return await this.repository.find()
        }catch(error){
            return null
        }
    } 
    public async delete(id:number):Promise<any>{
        try{
            return await this.repository.delete(id)
        }catch(error){
            return null
        }
    }
}