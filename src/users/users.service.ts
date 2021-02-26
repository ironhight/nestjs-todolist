import { Model } from 'mongoose';
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async getUserById(id: string): Promise<User> {
    const found = await this.userModel.findById(id);

    if (!found) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return found;
  }

  async updateUserById(id: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userModel.findById(id);
    const { email, phone, name, birthday, profileImage } = updateProfileDto;
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const exitsEmail = await this.userModel.findOne({ email, role: user.role });
    if (exitsEmail) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Duplicate email' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const exitsPhone = await this.userModel.findOne({ phone, role: user.role });
    if (exitsPhone) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Duplicate phone' },
        HttpStatus.BAD_REQUEST,
      );
    }

    user.email = email || user.email;
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.birthday = birthday || user.birthday;
    user.profileImage = birthday || user.birthday;

    await user.save();
    return user;
  }

  async updatePasswordById(id: string, updatePasswordDto: UpdatePasswordDto) {
    const { oldPassword, newPassword } = updatePasswordDto;

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new HttpException(
        { status: HttpStatus.NOT_ACCEPTABLE, error: 'Old password is not match' },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    user.password = newPassword;
    await user.save();

    return {
      status: 200,
      message: 'Change password success',
    };
  }

  async deleteUserById(id: string) {
    return await this.userModel.deleteOne({ _id: id });
  }
}
