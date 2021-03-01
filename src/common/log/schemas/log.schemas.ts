import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({
  timestamps: true,
  collection: 'logs',
})
export class Log {
  @Prop({ type: SchemaTypes.ObjectId, index: true })
  customer: string;

  @Prop({
    required: true,
    type: Number,
  })
  statusCode: string;

  @Prop({ required: true, type: String })
  ip: string;

  @Prop({ required: true, type: String })
  method: string;

  @Prop({ required: false, type: String })
  url: string;

  @Prop({ type: String })
  detail: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
