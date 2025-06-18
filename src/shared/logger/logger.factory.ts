import { ConfigService } from '@nestjs/config';
import { ILoggerService } from './logger.interface';
import { NestJSLoggerAdapter } from './adapters/nestjs-logger.adapter';

export type LoggerType = 'nestjs' | 'pino' | 'winston';

export class LoggerFactory {
  static create(
    type: LoggerType,
    configService: ConfigService,
  ): ILoggerService {
    switch (type) {
      case 'nestjs':
        return new NestJSLoggerAdapter(configService);
      case 'pino':
        throw new Error('Pino adapter not implemented yet');
      case 'winston':
        throw new Error('Winston adapter not implemented yet');
      default:
        return new NestJSLoggerAdapter(configService);
    }
  }
}
