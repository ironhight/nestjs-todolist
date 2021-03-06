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

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    const { role } = createUserDto;

    if (role === 'admin') {
      throw new HttpException(
        { status: HttpStatus.NOT_ACCEPTABLE, error: 'Admin not create' },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    await this.validateUser(createUserDto);

    await user.save();
    return user;
  }

  async signIn(authCredenticalsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    try {
      const user = await this.findByCredentials(authCredenticalsDto);
      const payload: JwtPayload = { _id: user._id, role: user.role, name: user.name };
      const accessToken = this.jwtService.sign(payload);

      this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

      return { accessToken };
    } catch (error) {
      console.error(error);
      if (error.response) return error.response;
      else throw new InternalServerErrorException();
    }
  }

  async findByCredentials(authCredentialsDto: AuthCredentialsDto): Promise<UserDocument> {
    const { email, password } = authCredentialsDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException(
        { status: HttpStatus.NOT_ACCEPTABLE, error: 'Email does not exits' },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(
        { status: HttpStatus.NOT_ACCEPTABLE, error: 'Wrong Password' },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return user;
  }

  async validateUser(createUserDto: CreateUserDto) {
    const { email, phone, role = 'customer' } = createUserDto;

    const exitsUserEmail = await this.userModel.findOne({ email, role });

    if (exitsUserEmail && exitsUserEmail.email) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Duplicate email' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const exitsUserPhone = await this.userModel.findOne({ phone, role });

    if (exitsUserPhone && exitsUserPhone.phone) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Duplicate phone' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
