import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  config.update({
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    region: 'ap-southeast-1',
    signatureVersion: 'v4',
  });
  await app.listen(3006);
  logger.log(`Application listening on port 3000`);
}
bootstrap();
