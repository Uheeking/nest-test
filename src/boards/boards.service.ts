import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import {v1 as uuid} from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService{
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository : BoardRepository
    ){}

    async getAllBoards(user: User) : Promise<Board[]>{
        const query = this.boardRepository.createQueryBuilder('board');
        query.where('board.userId = :userId', {userId: user.id})
        const boards = await query.getMany();
        return this.boardRepository.find();
    }
    // private boards: Board[] = [];

    // getAllBoards():Board[]{
    //     return this.boards; 
    // }
    // createBoard(createBoardDto:CreateBoardDto){
    //     const {title, description} = createBoardDto;
    //     const board : Board = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status:BoardStatus.PUBLIC
    //     }
    //     this.boards.push(board);
    //     return board;
    createBoard(createBoardDto: CreateBoardDto):Promise<Board>{
        return this.boardRepository.createBoard(createBoardDto,user)
    }

    // }
    async getBoardById(id: number) : Promise <Board>{
        const found = await this.boardRepository.findOne(id);

        if(!found){
            throw new NotFoundException('아이디를 찾을 수 없어여 ${id}')
        }
        return found;
    }
    // getBoardById(id: string): Board{
    //     const found = this.boards.find((board)=>board.id === id);

    //     if(!found){
    //         throw new NotFoundException(`아이디를 찾을 수 없어여 ${id}`);
    //     }
    //     return found;
    // }
    async deleteBoard(id:number, user: User): Promise<void>{
        const result = await this.boardRepository.delete({id, user});
        
        if(result.affected === 0){
            throw new NotFoundException('아이디를 찾을 수 없어여 ${id}')
        }

        console.log('result',result);
        
    }
    // deleteBoard(id: string):void{
    //     const found = this.getBoardById(id);
    //     this.boards = this.boards.filter((board)=>board.id !== found.id)
        
    // }
    async upadteBoardStatus(id:number, status:BoardStatus):Promise<Board>{
        const board = await this.getBoardById(id);
        board.status = status;
        await this.boardRepository.save(board)
        return board;
    }
}
