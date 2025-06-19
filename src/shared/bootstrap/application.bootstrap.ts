import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '../../app.module';
import { AppConfigurationService } from './app-configuration.service';
import { ErrorHandlerService } from './error-handler.service';

export class ApplicationBootstrap {
  private readonly logger = new Logger(ApplicationBootstrap.name);

  async init(): Promise<void> {
    try {
      const app = await NestFactory.create(AppModule);

      const configService = new AppConfigurationService(app);
      await configService.configure();

      const port = app
        .get<ConfigService>(ConfigService)
        .get<string>('PORT', '3000');
      await app.listen(port);

      this.logger.log(
        `🚀 Application is running on: http://localhost:${port}/api`,
      );
      this.logger.log(
        `🏥 Health check available at: http://localhost:${port}/api/health`,
      );
    } catch (error) {
      ErrorHandlerService.handleBootstrapError(error);
    }

    ErrorHandlerService.setupGlobalErrorHandling();
  }
}
