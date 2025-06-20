export class DatabaseConnectionError extends Error {
  constructor(operation: string) {
    super(`Database connection failed during ${operation}`);
    this.name = 'DatabaseConnectionError';
  }
}

export class DataIntegrityError extends Error {
  constructor(detail: string) {
    super(`Data integrity violation: ${detail}`);
    this.name = 'DataIntegrityError';
  }
}

export class RepositoryOperationFailedError extends Error {
  constructor(operation: string, entityType: string, reason: string) {
    super(`Failed to ${operation} ${entityType}: ${reason}`);
    this.name = 'RepositoryOperationFailedError';
  }
}

export class EntityNotFoundInRepositoryError extends Error {
  constructor(entityType: string, id: string) {
    super(`${entityType} with ID ${id} not found in repository`);
    this.name = 'EntityNotFoundInRepositoryError';
  }
}
