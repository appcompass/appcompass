import { AppService } from '@appcompass/common';
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  getServiceStatus() {
    return this.appService.getStatus();
  }

  @Post('users.status')
  @UseGuards(AuthGuard('interservice-api-key'))
  @ApiExcludeEndpoint(true)
  getInterServiceStatus() {
    return this.appService.getStatus();
  }
}
