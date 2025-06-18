import { Logger } from '@nestjs/common';

export class ErrorHandlerService {
  private static readonly logger = new Logger(ErrorHandlerService.name);

  static handleBootstrapError(error: unknown): never {
    this.logger.error('💥 Failed to start application', error);
    process.exit(1);
  }

  static setupGlobalErrorHandling(): void {
    process.on('uncaughtException', (error: Error) => {
      this.logger.error('💥 Uncaught Exception:', error);
      this.gracefulShutdown();
    });

    process.on('unhandledRejection', (reason: unknown) => {
      this.logger.error('💥 Unhandled Rejection:', reason);
      this.gracefulShutdown();
    });

    process.on('SIGTERM', () => {
      this.logger.log('🛑 SIGTERM received, shutting down gracefully');
      this.gracefulShutdown();
    });

    process.on('SIGINT', () => {
      this.logger.log('🛑 SIGINT received, shutting down gracefully');
      this.gracefulShutdown();
    });

    this.logger.debug('Global error handling configured');
  }

  private static gracefulShutdown(): void {
    process.exit(1);
  }
}
