import { AppService } from '@appcompass/common';
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

import { StatusResponse } from './app.status-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  @Post()
  getServiceStatus(): StatusResponse {
    return this.appService.getStatus();
  }

  @Post('authentication.status')
  @UseGuards(AuthGuard('interservice-api-key'))
  @ApiExcludeEndpoint(true)
  getInterServiceStatus() {
    return this.appService.getStatus();
  }
}
