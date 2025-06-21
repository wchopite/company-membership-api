import { Transaction } from '../entities/transaction.entity';

export const TransactionRepositoryToken = Symbol('TransactionRepository');

export interface TransactionRepository {
  findCompaniesByRecentTransactions(daysAgo: number): Promise<string[]>;
  findRecentByCompanyIds(
    companyIds: string[],
    daysAgo: number,
  ): Promise<Transaction[]>;
  findByCompanyId(companyId: string): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  countByCompanyIds(
    companyIds: string[],
    daysAgo: number,
  ): Promise<Map<string, number>>;
}
