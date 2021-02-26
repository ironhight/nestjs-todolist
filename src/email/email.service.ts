import { HttpService, Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UsersService,
    private httpService: HttpService,
  ) {}

  public async sendMail(
    mailto: string,
    subject: string,
    template: string,
    data: Record<any, any>,
    isVerify: boolean,
  ): Promise<boolean> {
    const { token } = data;
    const user = await this.userService.checkUserEmail(mailto);
    if (!user) {
      throw new NotFoundException(`User with ID "${mailto}" not found`);
    }

    user.resetPasswordToken = token;

    await user.save();

    await this.mailerService.sendMail({
      to: mailto,
      from: 'namtayemthatchac@gmail.com',
      subject: subject,
      template: 'index',
      context: data,
    });
    return true;
  }

  public async verifyEmail(email: string): Promise<boolean> {
    const result = await this.httpService
      .get<any>(
        `https://api.millionverifier.com/api/v3/?api=SbMhFPJtELCWz7TFCkMp73hn3&email=${email}`,
      )
      .toPromise();
    return result.data.resultcode == 1;
  }
}
