import { Global, Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerFactory, LoggerType } from './logger.factory';
import { ILoggerService } from './logger.interface';
import { LoggerServiceToken } from './logger.tokens';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(loggerType?: LoggerType): DynamicModule {
    return {
      module: LoggerModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: LoggerServiceToken,
          useFactory: (configService: ConfigService): ILoggerService => {
            const type =
              loggerType ||
              configService.get<LoggerType>('LOGGER_TYPE', 'nestjs');
            return LoggerFactory.create(type, configService);
          },
          inject: [ConfigService],
        },
      ],
      exports: [LoggerServiceToken],
    };
  }
}
