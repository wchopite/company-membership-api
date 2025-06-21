export const TransactionApplicationServiceToken = Symbol(
  'ITransactionApplicationService',
);

export interface ITransactionApplicationService {
  getCompanyIdsWithRecentTransfers(daysAgo: number): Promise<string[]>;
  getTransactionCountsByCompanyIds(
    companyIds: string[],
    daysAgo: number,
  ): Promise<Map<string, number>>;
}
