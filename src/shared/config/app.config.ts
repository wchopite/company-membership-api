import * as Joi from '@hapi/joi';
import { Environments } from './environments.enum';
import { DATABASE_TYPES } from '../database/database.constants';

export const globalConfigSchemaValidation = Joi.object({
  NODE_ENV: Joi.string().valid(...Object.values(Environments)),
  DATABASE_TYPE: Joi.string()
    .valid(DATABASE_TYPES.SQLITE, DATABASE_TYPES.POSTGRES, DATABASE_TYPES.MYSQL)
    .default(DATABASE_TYPES.SQLITE),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_NAME: Joi.string().default('database.sqlite'),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().when('DATABASE_TYPE', {
    is: Joi.valid(DATABASE_TYPES.POSTGRES, DATABASE_TYPES.MYSQL),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DATABASE_PASSWORD: Joi.string().when('DATABASE_TYPE', {
    is: Joi.valid(DATABASE_TYPES.POSTGRES, DATABASE_TYPES.MYSQL),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  LOGGER_LEVEL: Joi.string()
    .valid('error', 'warn', 'log', 'debug', 'verbose')
    .default('log'),
});

export const globalConfig = () => ({
  server: {
    port: parseInt(process.env.PORT ?? '3000', 10),
    environment: process.env.NODE_ENV || Environments.Development,
  },
  database: {
    type: process.env.DATABASE_TYPE || 'sqlite',
    name: process.env.DATABASE_NAME || 'database.sqlite',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'log',
  },
});
