import { Controller, Get, HttpCode, Inject } from '@nestjs/common';
import { ILoggerService, LoggerServiceToken } from '../logger';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(LoggerServiceToken) private readonly logger: ILoggerService,
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
