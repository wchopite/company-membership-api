import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import { API_PREFIX } from '../constants/api-prefix';

import helmet from 'helmet';

export class AppConfigurationService {
  private readonly logger = new Logger(AppConfigurationService.name);

  constructor(private readonly app: INestApplication) {}

  async configure(): Promise<void> {
    this.logger.log('🔧 Configuring application...');

    // Global prefix
    this.setupGlobalPrefix();

    // Validation
    this.setupValidation();

    // CORS
    this.setupCors();

    // Swagger
    if (process.env.NODE_ENV !== 'production') {
      await this.setupSwagger();
    }

    // Security
    this.setupSecurity();

    this.logger.log('✅ Application configured successfully');
  }

  private setupGlobalPrefix(): void {
    this.app.setGlobalPrefix(API_PREFIX);
    this.logger.debug(`Global prefix set to: ${API_PREFIX}`);
  }

  private setupValidation(): void {
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        validateCustomDecorators: true,
      }),
    );
    this.logger.debug('Global validation pipe configured');
  }

  private setupCors(): void {
    this.app.enableCors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    });
    this.logger.debug('CORS configured');
  }

  private async setupSwagger(): Promise<void> {
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug('Swagger documentation enabled');
    }
  }

  private setupSecurity(): void {
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
          },
        },
        crossOriginEmbedderPolicy: false,
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        },
        hidePoweredBy: true,
        noSniff: true,
        frameguard: {
          action: 'deny',
        },
        referrerPolicy: {
          policy: ['no-referrer', 'strict-origin-when-cross-origin'],
        },
      }),
    );
  }
}
