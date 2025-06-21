import { TransactionType, TransactionStatus } from '../enums';
import {
  InvalidTransactionAmountError,
  InvalidTransactionDateError,
  InvalidTransactionDescriptionError,
} from '../exceptions/transaction.exceptions';

export class Transaction {
  constructor(
    private readonly _id: string,
    private readonly _companyId: string,
    private readonly _type: TransactionType,
    private readonly _amount: number,
    private readonly _description: string,
    private readonly _status: TransactionStatus,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {
    this.validateAmount(_amount);
    this.validateCreatedAt(_createdAt);
    this.validateDescription(_description);
  }

  static reconstruct(
    id: string,
    companyId: string,
    type: TransactionType,
    amount: number,
    description: string,
    status: TransactionStatus,
    createdAt: Date,
    updatedAt: Date,
  ): Transaction {
    return new Transaction(
      id,
      companyId,
      type,
      amount,
      description,
      status,
      createdAt,
      updatedAt,
    );
  }

  get id(): string {
    return this._id;
  }

  get companyId(): string {
    return this._companyId;
  }

  get type(): TransactionType {
    return this._type;
  }

  get amount(): number {
    return this._amount;
  }

  get description(): string {
    return this._description;
  }

  get status(): TransactionStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isRecent(daysAgo: number): boolean {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    return this._createdAt >= cutoffDate;
  }

  private validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new InvalidTransactionAmountError(amount);
    }
  }

  private validateCreatedAt(createdAt: Date): void {
    const now = new Date();
    if (createdAt > now) {
      throw new InvalidTransactionDateError();
    }
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new InvalidTransactionDescriptionError();
    }
    if (description.length > 500) {
      throw new InvalidTransactionDescriptionError();
    }
  }
}
