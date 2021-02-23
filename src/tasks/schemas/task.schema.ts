import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TaskStatus } from '../task-status.enum';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({ type: String }) status: TaskStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
