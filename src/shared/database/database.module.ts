import { Global, Module, DynamicModule } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { DatabaseConfigService } from './database.config.service';
import { DatabaseType } from './database.types';
import {
  DATABASE_CONFIG_TOKEN,
  DATABASE_CONNECTION_TOKEN,
} from './database.tokens';
import { TransactionManager } from './database.transaction-manager';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(databaseType?: DatabaseType): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            let dbConfig = configService.get('database');

            if (databaseType) {
              dbConfig = { ...dbConfig, type: databaseType };
            }

            return DatabaseConfigService.createTypeOrmConfig(dbConfig);
          },
          inject: [ConfigService],
        }),
      ],
      providers: [
        TransactionManager,
        {
          provide: DATABASE_CONFIG_TOKEN,
          useFactory: (configService: ConfigService) => {
            let dbConfig = configService.get('database');

            if (databaseType) {
              dbConfig = { ...dbConfig, type: databaseType };
            }

            return dbConfig;
          },
          inject: [ConfigService],
        },
        {
          provide: DATABASE_CONNECTION_TOKEN,
          useFactory: (dataSource: DataSource) => dataSource,
          inject: [getDataSourceToken()],
        },
      ],
      exports: [TypeOrmModule, DATABASE_CONFIG_TOKEN],
    };
  }
}
