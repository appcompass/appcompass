import { Request, Response } from 'express';

import { AuthenticatedRequest, AuthService, TokenUser } from '@appcompass/common';
import { ConsoleLogger, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller({ version: '1' })
export class AuthController {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly authService: AuthService
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const user = req.user as TokenUser;
    const { accessToken, refreshToken } = await this.authService.login(user);
    const expires = await this.authService.getTokenExpDate(refreshToken);

    response.cookie('Refresh', refreshToken, {
      expires,
      httpOnly: true
    });
    return { accessToken };
  }

  @UseGuards(AuthGuard('jwt-refresh-cookie'))
  @Get('logout')
  async logout(@Req() req: AuthenticatedRequest) {
    return await this.authService.logout(req.user);
  }

  @UseGuards(AuthGuard('jwt-refresh-cookie'))
  @Get('refresh')
  async refresh(@Req() req: AuthenticatedRequest) {
    return await this.authService.refresh(req.user);
  }
}
