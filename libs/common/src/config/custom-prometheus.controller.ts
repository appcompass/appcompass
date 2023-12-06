import { Response } from 'express';

import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeController } from '@nestjs/swagger';
import { PrometheusController } from '@willsoto/nestjs-prometheus';

@Controller()
@UseGuards(AuthGuard('bearer-api-key'))
@ApiExcludeController(true)
export class CustomPrometheusController extends PrometheusController {
  @Get()
  async index(@Res() response: Response) {
    return super.index(response);
  }
}
