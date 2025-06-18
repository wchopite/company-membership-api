import {
  Injectable,
  LogLevel,
  LoggerService as NestLoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ILoggerService } from '../logger.interface';

@Injectable()
export class NestJSLoggerAdapter implements ILoggerService, NestLoggerService {
  private context?: string;
  private readonly isDevelopment: boolean;
  private readonly logLevels: LogLevel[];

  constructor(private readonly configService: ConfigService) {
    this.isDevelopment =
      this.configService.get<string>('NODE_ENV') !== 'production';
    this.logLevels = this.getLogLevels();
  }

  private getLogLevels(): LogLevel[] {
    const level = this.configService.get<string>('LOGGER_LEVEL', 'log');

    const levelMap: Record<string, LogLevel[]> = {
      error: ['error'],
      warn: ['error', 'warn'],
      log: ['error', 'warn', 'log'],
      debug: ['error', 'warn', 'log', 'debug'],
      verbose: ['error', 'warn', 'log', 'debug', 'verbose'],
    };

    return levelMap[level] || ['error', 'warn', 'log'];
  }

  setContext(context: string): void {
    this.context = context;
  }

  log(message: any, context?: string, ...optionalParams: any[]): void {
    if (!this.logLevels.includes('log')) return;
    this.formatAndLog('LOG', message, context || this.context, optionalParams);
  }

  error(
    message: any,
    trace?: string,
    context?: string,
    ...optionalParams: any[]
  ): void {
    if (!this.logLevels.includes('error')) return;
    this.formatAndLog(
      'ERROR',
      message,
      context || this.context,
      optionalParams,
      trace,
    );
  }

  warn(message: any, context?: string, ...optionalParams: any[]): void {
    if (!this.logLevels.includes('warn')) return;
    this.formatAndLog('WARN', message, context || this.context, optionalParams);
  }

  debug(message: any, context?: string, ...optionalParams: any[]): void {
    if (!this.logLevels.includes('debug')) return;
    this.formatAndLog(
      'DEBUG',
      message,
      context || this.context,
      optionalParams,
    );
  }

  verbose(message: any, context?: string, ...optionalParams: any[]): void {
    if (!this.logLevels.includes('verbose')) return;
    this.formatAndLog(
      'VERBOSE',
      message,
      context || this.context,
      optionalParams,
    );
  }

  private formatAndLog(
    level: string,
    message: any,
    context?: string,
    optionalParams?: any[],
    trace?: string,
  ): void {
    const timestamp = new Date().toISOString();
    const pid = process.pid;
    const ctx = context ? `[${context}]` : '';

    if (this.isDevelopment) {
      const colors = {
        LOG: '\x1b[32m', // Green
        ERROR: '\x1b[31m', // Red
        WARN: '\x1b[33m', // Yellow
        DEBUG: '\x1b[36m', // Cyan
        VERBOSE: '\x1b[35m', // Magenta
        RESET: '\x1b[0m',
      };

      const coloredLevel = `${colors[level as keyof typeof colors]}[${level}]${colors.RESET}`;
      const formattedMessage = this.formatMessage(message, optionalParams);

      console.log(
        `${coloredLevel} ${timestamp} [${pid}] ${ctx} ${formattedMessage}`,
      );

      if (trace) {
        console.log(`${colors.ERROR}${trace}${colors.RESET}`);
      }
    } else {
      const logEntry = {
        timestamp,
        level,
        pid,
        context,
        message: this.sanitizeMessage(message),
        ...this.parseOptionalParams(optionalParams),
      };

      if (trace) {
        logEntry['trace'] = trace;
      }

      console.log(JSON.stringify(logEntry));
    }
  }

  private formatMessage(message: any, optionalParams?: any[]): string {
    const sanitized = this.sanitizeMessage(message);

    if (optionalParams && optionalParams.length > 0) {
      const params = optionalParams
        .map((param) =>
          typeof param === 'object'
            ? JSON.stringify(this.sanitizeObject(param), null, 2)
            : param,
        )
        .join(' ');
      return `${sanitized} ${params}`;
    }

    return sanitized;
  }

  private parseOptionalParams(optionalParams?: any[]): any {
    if (!optionalParams || optionalParams.length === 0) return {};

    const params: any = {};
    optionalParams.forEach((param, index) => {
      if (typeof param === 'object' && param !== null) {
        Object.assign(params, this.sanitizeObject(param));
      } else {
        params[`param${index}`] = param;
      }
    });

    return params;
  }

  private sanitizeMessage(message: any): string {
    if (typeof message === 'object') {
      return JSON.stringify(this.sanitizeObject(message));
    }
    return String(message);
  }

  private sanitizeObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
      'auth',
    ];
    const sanitized = { ...obj };

    for (const key in sanitized) {
      if (
        sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))
      ) {
        sanitized[key] = '[FILTERED]';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitizeObject(sanitized[key]);
      }
    }

    return sanitized;
  }

  logRequest(method: string, url: string, params?: any): void {
    this.log(`${method} ${url}`, 'HTTP', {
      params: this.sanitizeObject(params),
    });
  }

  logResponse(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
  ): void {
    this.log(`${method} ${url} ${statusCode}`, 'HTTP', {
      duration: `${duration}ms`,
    });
  }

  logError(error: Error, context?: string): void {
    this.error(error.message, error.stack, context, {
      name: error.name,
      cause: error.cause,
    });
  }
}
