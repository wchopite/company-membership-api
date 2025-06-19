export const DATABASE_TOKENS = {
  CONFIG: Symbol('DatabaseConfig'),
  CONNECTION: Symbol('DatabaseConnection'),
} as const;

export const DATABASE_CONFIG_TOKEN = DATABASE_TOKENS.CONFIG;
export const DATABASE_CONNECTION_TOKEN = DATABASE_TOKENS.CONNECTION;
