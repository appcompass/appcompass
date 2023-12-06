import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';

import { DecodedToken } from '@appcompass/common';
import { User } from '@appcompass/common/entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UsersService } from './services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly dataSource: DataSource,
    readonly usersService: UsersService,
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
    const user: User = await this.dataSource.transaction(
      async (manager) => await this.usersService.findBy(manager, { id: token.sub })
    );

    return dayjs(user.lastLogout).isSameOrBefore(tokenIssuedAt, 'second') ? token : false;
  }
}
