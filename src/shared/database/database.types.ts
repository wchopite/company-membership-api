import { DATABASE_TYPES } from './database.constants';

export type DatabaseType = (typeof DATABASE_TYPES)[keyof typeof DATABASE_TYPES];

export interface DatabaseConfig {
  type: DatabaseType;
  name: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  synchronize?: boolean;
  logging?: boolean;
}
