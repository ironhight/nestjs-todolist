import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../common/guards/roles.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;

          schema.pre<UserDocument>('save', async function (next) {
            const user = this;
            if (user.isModified('password')) {
              user.password = await bcrypt.hash(user.password, 10);
            }
            next();
          });
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
