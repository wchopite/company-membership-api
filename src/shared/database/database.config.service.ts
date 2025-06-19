import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig } from './database.types';
import { DATABASE_TYPES } from './database.constants';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseConfigService {
  static createTypeOrmConfig(config: DatabaseConfig): TypeOrmModuleOptions {
    const baseTypeOrmConfig = {
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      synchronize: config.synchronize,
      logging: config.logging,
    };

    switch (config.type) {
      case DATABASE_TYPES.SQLITE:
        return {
          type: 'sqlite',
          database: config.name,
          ...baseTypeOrmConfig,
        };

      case DATABASE_TYPES.POSTGRES:
        return {
          type: 'postgres',
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          database: config.name,
          ...baseTypeOrmConfig,
        };

      case DATABASE_TYPES.MYSQL:
        return {
          type: 'mysql',
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          database: config.name,
          ...baseTypeOrmConfig,
        };

      default:
        throw new Error(`TypeORM not supported for: ${config.type}`);
    }
  }

  static async healthCheck(
    config: DatabaseConfig,
  ): Promise<{ status: string; details: any }> {
    try {
      return {
        status: 'healthy',
        details: {
          type: config.type,
          database: config.name,
          host: config.host || 'local',
          synchronize: config.synchronize,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          type: config.type,
        },
      };
    }
  }

  static async realHealthCheck(
    dataSource: DataSource,
  ): Promise<{ status: string; details: any }> {
    try {
      await dataSource.query('SELECT 1');
      return { status: 'healthy', details: {} };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}
