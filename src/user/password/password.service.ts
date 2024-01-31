import { Injectable } from '@nestjs/common';
import * as argon2 from "argon2"

@Injectable()
export class PasswordService {
    public hashPassword = async(password:string):Promise<string>=>{
        try{
            const hashedPassword = await argon2.hash(password)
            return hashedPassword
        }catch(error){
            console.log(error)
            return ''
        }
    }
    public verifyPassword = async(userPassword:string,inputPassword:string):Promise<boolean>=>{
        try {
            if (await argon2.verify(userPassword, inputPassword)) return true
            else return false
          } catch (error) {
            console.log(error)
            return false
          }
    }
}
