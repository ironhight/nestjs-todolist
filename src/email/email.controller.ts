import { Controller, ValidationPipe, Body, Post, HttpCode } from '@nestjs/common';
import { EmailService } from './email.service';
import * as crypto from 'crypto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/send-mail')
  @HttpCode(200)
  async sendMail(@Body('email', ValidationPipe) email: string): Promise<any> {
    const token = crypto.randomBytes(60).toString('hex');

    const result = await this.emailService.sendMail(
      email,
      'Email Forgot Password',
      'index',
      {
        link: `http://localhost:3000/user/reset-password?token=${token}&email=${email}`,
        token,
      },
      true,
    );

    return result;
  }
}
