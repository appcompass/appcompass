import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { TokenUser } from '../dtos';
import { MessagingService } from '../messaging';
import { DecodedToken } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly messagingService: MessagingService,
    readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('PUBLIC_KEY')
    });
    dayjs.extend(isSameOrBefore);
  }

  async validate(token: DecodedToken) {
    const tokenIssuedAt = dayjs.unix(token.iat);
    const user: TokenUser = await this.messagingService.sendAsync('users.user.find-by', { id: token.sub });
    return dayjs(user.lastLogout).isSameOrBefore(tokenIssuedAt, 'second') ? token : false;
  }
}
