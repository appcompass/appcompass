import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { APIAuthStrategy } from './api-auth-passport.strategy';

@Injectable()
export class InterserviceApiKeyStrategy extends PassportStrategy(APIAuthStrategy, 'interservice-api-key') {
  constructor(readonly configService: ConfigService) {
    super(false, true, (apiKey: string, done: (...args: unknown[]) => unknown) => {
      return done(
        null,
        this.configService.get('INTERSERVICE_API_KEY') == apiKey
          ? { service: this.configService.get('SERVICE_NAME') }
          : false
      );
    });
  }
}
