import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getStatus() {
    return {
      serviceName: this.configService.get('SERVICE_NAME'),
      gitHash: this.configService.get('GIT_HASH'),
      version: this.configService.get('GIT_TAG')
    };
  }
}
