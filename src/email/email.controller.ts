import { Controller, ValidationPipe, Body, Post, HttpCode } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/send-mail')
  @HttpCode(200)
  async sendMail(@Body('email', ValidationPipe) email: string): Promise<any> {
    const result = await this.emailService.sendMail(
      email,
      'Email Forgot Password',
      'index',
      {
        code: new Date().getTime(),
      },
      true,
    );

    return result;
  }
}
