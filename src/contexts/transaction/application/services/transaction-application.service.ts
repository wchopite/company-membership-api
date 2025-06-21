import { Inject, Injectable } from '@nestjs/common';
import { ITransactionApplicationService } from './interfaces/transaction-application.service.interface';
import {
  TransactionRepository,
  TransactionRepositoryToken,
} from '../../domain/repositories/transaction.repository';
import { LoggerServiceToken, ILoggerService } from '../../../../shared/logger';

@Injectable()
export class TransactionApplicationService
  implements ITransactionApplicationService
{
  constructor(
    @Inject(TransactionRepositoryToken)
    private readonly transactionRepository: TransactionRepository,
    @Inject(LoggerServiceToken)
    private readonly logger: ILoggerService,
  ) {}

  async getCompanyIdsWithRecentTransfers(daysAgo: number): Promise<string[]> {
    this.logger.log(
      `Getting companies with recent transfers (${daysAgo} days ago)`,
    );

    const companyIds =
      await this.transactionRepository.findCompaniesByRecentTransactions(
        daysAgo,
      );

    this.logger.log(
      `Found ${companyIds.length} companies with recent transfers`,
    );
    return companyIds;
  }

  async getTransactionCountsByCompanyIds(
    companyIds: string[],
    daysAgo: number,
  ): Promise<Map<string, number>> {
    this.logger.log(
      `Getting transaction counts for ${companyIds.length} companies (${daysAgo} days ago)`,
    );

    const countMap = await this.transactionRepository.countByCompanyIds(
      companyIds,
      daysAgo,
    );

    this.logger.log(
      `Retrieved transaction counts for ${countMap.size} companies`,
    );
    return countMap;
  }
}
