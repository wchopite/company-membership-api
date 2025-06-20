import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './shared/health';
import { LoggerModule } from './shared/logger';
import { DatabaseModule } from './shared/database';
import {
  globalConfig,
  globalConfigSchemaValidation,
} from './shared/config/app.config';

import { DATABASE_TYPES } from './shared/database/database.constants';
import { CompanyModule } from './contexts/company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [globalConfig],
      validationSchema: globalConfigSchemaValidation,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    LoggerModule.forRoot(),
    DatabaseModule.forRoot(DATABASE_TYPES.SQLITE),
    HealthModule,
    CompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
