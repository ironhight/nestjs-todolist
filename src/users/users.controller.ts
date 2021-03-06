import {
  Controller,
  Get,
  Logger,
  Param,
  ValidationPipe,
  Delete,
  Patch,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../common/guards/decorators/roles.decorator';
import { UserRole } from '../common/guards/enums/user-role.enum';
import { User } from '../users/schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('user')
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(private readonly usersService: UsersService) {}

  @Get('/reset-password')
  resetPassword(@Query() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  @Get('/all')
  @Roles(UserRole.Admin)
  getAllUser(): Promise<User[]> {
    return this.usersService.getAllUser();
  }

  @Get('/:id')
  getUserById(@Param('id', ValidationPipe) id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Patch('/:id')
  @Roles(...[UserRole.Customer, UserRole.Admin])
  updateUserById(
    @Param('id', ValidationPipe) id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    return this.usersService.updateUserById(id, updateProfileDto);
  }

  @Patch('/change-password/:id')
  @Roles(...[UserRole.Customer, UserRole.Admin])
  updatePasswordById(
    @Param('id', ValidationPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ status: number; message: string }> {
    return this.usersService.updatePasswordById(id, updatePasswordDto);
  }

  @Post('/upload-avatar/:id')
  @Roles(...[UserRole.Customer, UserRole.Admin])
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  uploadAvatarById(
    @Param('id', ValidationPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatarById(id, file.buffer, file.originalname);
  }

  @Delete('/:id')
  @Roles(UserRole.Admin)
  deleteUserById(@Param('id', ValidationPipe) id: string) {
    return this.usersService.deleteUserById(id);
  }
}
