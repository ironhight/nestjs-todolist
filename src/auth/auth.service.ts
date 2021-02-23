import { Model } from 'mongoose';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthValidatorDto } from './dto/auth-validator.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new this.userModel(createUserDto);
      await this.validateUser(createUserDto);

      await user.validate();

      await user.save();
      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async signIn(authCredenticalsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    try {
      const user = await this.findByCredentials(authCredenticalsDto);
      const payload: JwtPayload = { _id: user._id, userType: user.userType, name: user.name };
      const accessToken = this.jwtService.sign(payload);

      this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

      return { accessToken };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findByCredentials(authCredentialsDto: AuthCredentialsDto): Promise<UserDocument> {
    const { email, password } = authCredentialsDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('Email không tồn tại trong hệ thống');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Mật khẩu không chính xác');
    }

    return user;
  }

  async validateUser(authValidatorDto: AuthValidatorDto) {
    try {
      const { email, phone } = authValidatorDto;

      const exitsUserEmail = await this.userModel.findOne({ email });

      if (exitsUserEmail.email) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Duplicate email' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const exitsUserPhone = await this.userModel.findOne({ phone });

      if (exitsUserPhone.phone) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Duplicate phone' },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
