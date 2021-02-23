import { Controller, Get, UseGuards, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard())
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  async getUserById(@Param('id', ParseIntPipe) id: string) {
    await this.usersService.getUserById(id);
  }

  @Get('/:id')
  async getUserById() {
    
  }
}
