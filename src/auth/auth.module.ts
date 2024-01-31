import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
    imports:[
        JwtModule.register({
            global:true,
            secret:'demo-secret',
            signOptions:{expiresIn:'30d'}
        })
    ],
    providers:[AuthService],
    exports:[AuthService]
})
export class AuthModule {
    
}
