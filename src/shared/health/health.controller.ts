import { Controller, Get, HttpCode, Inject } from '@nestjs/common';
import { ILoggerService, LOGGER_SERVICE_TOKEN } from '../logger';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(LOGGER_SERVICE_TOKEN) private readonly logger: ILoggerService,
  ) {
    this.logger.setContext('HealthController');
  }

  @Get()
  @HttpCode(200)
  run() {
    this.logger.log('Health endpoint called!');
    return { status: 'ok' };
  }
}
