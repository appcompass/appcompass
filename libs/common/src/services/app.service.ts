import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getStatus() {
    return {
      serviceName: this.configService.get('SERVICE_NAME'),
      serviceInstance: this.configService.get('SERVICE_INSTANCE_NUMBER'),
      gitHash: this.configService.get('GIT_HASH'),
      version: this.configService.get('GIT_TAG')
    };
  }
}
