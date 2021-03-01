import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema, Log } from './schemas/log.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
