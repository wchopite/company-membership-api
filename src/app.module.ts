import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './shared/health/health.module';
import { LoggerModule } from './shared/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule.forRoot(),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
