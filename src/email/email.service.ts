import { HttpService, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService, private httpService: HttpService) {}

  public async sendMail(
    mailto: string,
    subject: string,
    template: string,
    data: Record<any, any>,
    isVerify: boolean,
  ): Promise<boolean> {
    if (isVerify) {
      const arrayEmail = mailto.split(',');
      for (const i in arrayEmail) {
        if (!(await this.verifyEmail(arrayEmail[i]))) {
          return false;
        }
      }
    }

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
