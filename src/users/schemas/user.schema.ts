import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, type: String, lowercase: true })
  name: string;

  @Prop({
    required: true,
    type: String,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({ required: true, minLength: 5, type: String })
  password: string;

  @Prop({ required: true, type: String, trim: true, maxLength: 10 })
  phone: string;

  @Prop({ required: false, type: String, trim: true })
  birthday: string;

  @Prop({ type: String, trim: true })
  profileImage: string;

  @Prop({ required: true, type: String, default: 'customer' })
  userType: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
