import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from './boards/board.modules';
import { TypeORMConfig } from './boards/config/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeORMConfig),
    BoardsModule,
    AuthModule,
  ],
})
export class AppModule {}