import { Controller, Get, UseGuards, Logger, Param, ValidationPipe, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';
import { User } from '../users/schemas/user.schema';

@Controller('user')
@UseGuards(AuthGuard())
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  getUserById(@Param('id', ValidationPipe) id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Delete('/:id')
  @Roles(UserRole.Admin)
  deleteUserById(@Param('id', ValidationPipe) id: string) {
    return this.usersService.deleteUserById(id);
  }
}
