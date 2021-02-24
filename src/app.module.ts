import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/todo-list', {
      useNewUrlParser: true,
    }),
    UsersModule,
    AuthModule,
    TasksModule,
    EmailModule,
  ],
})
export class AppModule {}
