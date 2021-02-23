import { IsString, MaxLength, IsEmail } from 'class-validator';
import { CreateTaskDto } from '../../tasks/dto/create-task.dto';
import { CreateUserDto } from './create-user.dto';

export class AuthValidatorDto extends CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(10)
  phone: string;
}
