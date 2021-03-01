import { BaseExceptionFilter } from '@nestjs/core';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LogService } from '../log/log.service';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly logService: LogService, private readonly config: ConfigService) {
    super();
  }

  async catch(exception: RuntimeException | HttpException, host: ArgumentsHost): Promise<any> {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    this.logService.create(
      request,
      exception.stack,
      response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    );
    if (exception instanceof BadRequestException) {
      const messages = exception['response']['message'];
      const statusCode = HttpStatus.BAD_REQUEST;
      response.status(statusCode).json({
        status: false,
        statusCode: statusCode,
        message: messages,
      });
    } else if (['CastError', 'ValidationError'].includes(exception.constructor.name)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      response.status(statusCode).json({
        status: false,
        statusCode: statusCode,
        message: exception['message'].split('.,').map((msg) =>
          msg
            .split(':')
            .slice(-1)[0]
            .replace(/(`|Path)/g, '')
            .trim(),
        ),
      });
    } else if (exception instanceof ForbiddenException) {
      const statusCode = HttpStatus.FORBIDDEN;
      response.status(statusCode).json({
        status: false,
        statusCode: statusCode,
        message: 'Permission denied!',
      });
    } else if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      response.status(statusCode).json(exception.getResponse());
    } else if (exception.constructor.name == 'TokenExpiredError') {
      const statusCode = 401;
      response.status(statusCode).json({
        status: false,
        statusCode: statusCode,
        message: 'Token is expired',
      });
    } else {
      let message = 'Internal server error';
      //error mongoose unique
      if ((exception['code'] || '') == 11000 && typeof exception['errmsg'] != 'undefined') {
        message =
          exception['errmsg'].substring(
            exception['errmsg'].indexOf('index: ') + 7,
            exception['errmsg'].indexOf('_1'),
          ) + ' must be unique';
      }
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.status(statusCode).json({
        status: false,
        statusCode: statusCode,
        message: message,
        errors:
          this.config.get('node.env') == 'production' ? '' : (exception as RuntimeException).stack,
      });
    }
  }
}
