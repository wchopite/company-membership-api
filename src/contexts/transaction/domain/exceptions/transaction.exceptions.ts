export class TransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransactionError';
  }
}

export class InvalidTransactionAmountError extends TransactionError {
  constructor(amount: number) {
    super(`Invalid transaction amount: ${amount}. Amount must be positive.`);
    this.name = 'InvalidTransactionAmountError';
  }
}

export class InvalidTransactionDateError extends TransactionError {
  constructor() {
    super('Transaction date cannot be in the future.');
    this.name = 'InvalidTransactionDateError';
  }
}

export class InvalidTransactionDescriptionError extends TransactionError {
  constructor() {
    super(
      'Transaction description must be provided and cannot exceed 500 characters.',
    );
    this.name = 'InvalidTransactionDescriptionError';
  }
}

export class TransactionNotFoundError extends TransactionError {
  constructor(id: string) {
    super(`Transaction with id ${id} not found.`);
    this.name = 'TransactionNotFoundError';
  }
}

export class NoTransactionsFoundForCompanyError extends TransactionError {
  constructor(companyId: string) {
    super(`No transactions found for company with id ${companyId}.`);
    this.name = 'NoTransactionsFoundForCompanyError';
  }
}

export class TransactionRepositoryError extends TransactionError {
  constructor(operation: string, cause?: Error) {
    super(
      `Transaction repository error during ${operation}: ${cause?.message || 'Unknown error'}`,
    );
    this.name = 'TransactionRepositoryError';
  }
}
