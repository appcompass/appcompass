import { AuthService } from '@appcompass/common';
import { Body, ConsoleLogger, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@UseGuards(AuthGuard('interservice-api-key'))
@ApiExcludeController(true)
export class InterServiceController {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly authService: AuthService
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Post('authentication.user.login-by-id')
  async loginUserById(@Body() { id }: { id: string }) {
    return await this.authService.loginBy({ id });
  }

  @Post('authentication.user.login-by-email')
  async loginUserByEmail(@Body() { email }: { email: string }) {
    return await this.authService.loginBy({ email });
  }

  @Post('authentication.user.logout')
  async logoutById(@Body() { id }: { id: string }) {
    return await this.authService.logoutBy({ id });
  }

  @Post('authentication.user.get-access-token')
  async getAccessTokenByUserId(@Body() { id }: { id: string }) {
    return await this.authService.generateAccessTokenById(id);
  }

  @Post('authentication.user.get-refresh-token')
  async getRefreshTokenByUserId(@Body() { id }: { id: string }) {
    return await this.authService.generateRefreshTokenById(id);
  }

  @Post('authentication.user.get-tokens')
  async getTokensByUserId(@Body() { id }: { id: string }) {
    const [refreshToken, accessToken] = await Promise.all([
      this.authService.generateRefreshTokenById(id),
      this.authService.generateAccessTokenById(id)
    ]);
    return { refreshToken, accessToken };
  }

  @Post('authentication.token.create')
  async createToken(@Body() payload: Record<string | number | symbol, unknown>) {
    return await this.authService.createToken(payload);
  }
}
