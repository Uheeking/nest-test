import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthCredentialsDto } from './auth-credential.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    // localhost:3000/auth/signUp
    @Post('/singup')
    signUp(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto): Promise<void>{
        return this.authService.signUp(authCredentialsDto)
    }

    @Post('/singin')
    singIn(@Body(ValidationPipe) authCredentialsDto:AuthCredentialsDto): Promise<{accessToken : string>{
        return this.authService.singIn(authCredentialsDto)
    }
    @Post('/test')
    @UseGuards(AuthGuard())
    test(@Req() req){
        console.log(req);
        
    }
}
