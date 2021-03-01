import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from './schemas/log.schemas';
import { Model } from 'mongoose';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<LogDocument>) {}

  async create(request: Record<any, any>, errors?: string, statusCode?: number): Promise<Log> {
    const { ip, method, originalUrl } = request;

    return await new this.logModel({
      customer: request.user ? request.user.id : null,
      statusCode: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      ip: ip,
      method: method,
      url: originalUrl,
      detail: errors,
    }).save();
  }
}
