import { NextFunction, Request, Response } from 'express';

import { ConsoleLogger, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LogInterserviceRequestsMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly configService: ConfigService
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    this.logger.setContext(`${this.constructor.name} ${this.configService.get('SERVICE_INSTANCE_NUMBER')}`);
    const { ip, body } = request;
    const userAgent = request.get('user-agent') || '';
    const requestingService = request.headers['x-requesting-service'] || 'unknown';
    this.logger.log(
      `${requestingService}: ${request.url} ${response.statusCode} - ${userAgent} - ${ip} - ${JSON.stringify(body)}`
    );

    next();
  }
}
