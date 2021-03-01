import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/exception/all-exception.filter';
import { LogModule } from './common/log/log.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/todo-list', {
      useNewUrlParser: true,
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    UsersModule,
    AuthModule,
    TasksModule,
    EmailModule,
    LogModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
