import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';

import { ConsoleLogger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../db/entities';
import { TokenUser } from '../dtos';
import { MessagingService } from '../messaging';

@Injectable()
export class AuthService {
  private saltRounds = 10;

  constructor(
    private readonly logger: ConsoleLogger,
    private readonly messagingService: MessagingService,
    private readonly jwtService: JwtService
  ) {
    this.logger.setContext(this.constructor.name);
  }

  setPassword(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds);
  }

  async validateUser(email: string, pass: string): Promise<TokenUser | null> {
    const user = await this.messagingService.sendAsync<User>('users.user.find-by', {
      email,
      active: true
    });
    if (!user || !user.password) return null;
    if (bcrypt.compareSync(pass, user.password)) return new TokenUser(user);
    else return null;
  }

  async loginBy(payload: Partial<{ id: string; email: string }>) {
    const user = await this.buildUserTokenObject(payload);
    if (!user) return null;

    return await this.login(user);
  }

  async logoutBy(payload: Partial<TokenUser>) {
    await this.messagingService.sendAsync('users.user.update', {
      ...payload,
      lastLogout: dayjs()
    });
    this.logger.log(`Logout from User by: ${JSON.stringify(payload)}`);

    return { success: true };
  }

  async buildUserTokenObject(payload: Partial<{ id: string; email: string }>) {
    const user = await this.messagingService.sendAsync<TokenUser>('users.user.find-by', {
      ...payload,
      active: true
    });
    if (!user || !user.id) return null;

    return new TokenUser(user);
  }

  async generateRefreshToken(user: TokenUser) {
    const { id } = user;
    const expiresIn = '7d';
    return await this.jwtService.signAsync(
      {
        sub: id,
        type: 'refresh'
      },
      { expiresIn }
    );
  }

  async generateAccessToken(user: TokenUser) {
    const { id, email, lastLogin } = user;
    const expiresIn = '15m';
    return await this.jwtService.signAsync(
      {
        id,
        email,
        lastLogin,
        sub: id,
        type: 'access'
      },
      {
        expiresIn
      }
    );
  }

  async generateAccessTokenById(id: string) {
    const user = await this.buildUserTokenObject({ id });
    if (!user) return null;
    return await this.generateAccessToken(user);
  }

  async generateRefreshTokenById(id: string) {
    const user = await this.messagingService.sendAsync<TokenUser>('users.user.find-by', {
      id,
      active: true
    });

    if (!user || !user.id) return null;
    return await this.generateRefreshToken(user);
  }

  async login(user: TokenUser) {
    const [refreshToken, accessToken] = await Promise.all([
      this.generateRefreshToken(user),
      this.generateAccessToken(user)
    ]);

    await this.messagingService.sendAsync('users.user.update', {
      id: user.id,
      lastLogin: dayjs()
    });
    this.logger.log(`Login from User Id: ${user.id}`);
    return { refreshToken, accessToken };
  }

  async logout(user: TokenUser) {
    const { id } = user;
    await this.messagingService.sendAsync('users.user.update', {
      id,
      lastLogout: dayjs()
    });
    this.logger.log(`Logout from User Id: ${id}`);

    return { success: true };
  }

  async refresh(user: TokenUser) {
    const accessToken = await this.generateAccessToken(user);
    return { accessToken };
  }

  async createToken(payload: Record<string | number | symbol, unknown>) {
    return await this.jwtService.signAsync(payload);
  }

  async getTokenExpDate(token: string) {
    const decoded = await this.jwtService.decode(token);
    return dayjs.unix(decoded.exp).toDate();
  }
}
