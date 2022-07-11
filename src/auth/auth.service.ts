import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './auth-credential.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository,
        private jwtService : JwtService
    ){}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
        return this.userRepository.createUser(authCredentialsDto)
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{asccessToken: string}>{
        const {username, password} = authCredentialsDto;
        const user = await this.userRepository.findOne({username})

        if(user && (await bcrypt.compare(password, user.password))){
            const payload = { username };
            const asccessToken = await this.jwtService.sign(payload);

            return {asccessToken};
        }else{
            throw new UnauthorizedException('login failed')
        }
    }
}
