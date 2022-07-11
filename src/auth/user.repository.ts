import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { authCredentialsDto } from './auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(authCredentialsDto: authCredentialsDto): Promise<void>{
        const {username, password} = authCredentialsDto;

        const salt = await bcrypt.getSalt();
        const hasedPassword = await bcrypt.hash(password, salt);

        const user = this.create({username, password:hasedPassword})
        
        try{
            await this.save(user)
        }catch(error){
            if(error.code === '23505'){
                throw new ConflictException('Existing username')
            }else{
                throw new InternalServerErrorException();
            }
            console.log('error',error);
            
        }
    }
}
