import { HttpModule, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    HttpModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'namtayemthatchac@gmail.com',
            pass: 'sieunhan@123',
          },
        },
        defaults: {
          from: 'namtayemthatchac@gmail.com',
        },
        template: {
          dir: process.cwd() + '/src/email/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
