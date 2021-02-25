import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  birthday: string;

  @IsNotEmpty()
  profileImage: string;
}
