import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../interfaces/use-case.interface';
import { CompanyWithTransfersDto } from '../dto/out/company-with-transfers.dto';
import {
  CompanyRepository,
  CompanyRepositoryToken,
} from '../../domain/repositories/company.repository';
import {
  ITransactionApplicationService,
  TransactionApplicationServiceToken,
} from '../../../transaction/application/services/interfaces/transaction-application.service.interface';
import { LoggerServiceToken, ILoggerService } from '../../../../shared/logger';

@Injectable()
export class GetCompaniesWithRecentTransfersUseCase
  implements UseCase<void, CompanyWithTransfersDto[]>
{
  constructor(
    @Inject(CompanyRepositoryToken)
    private readonly companyRepository: CompanyRepository,
    @Inject(TransactionApplicationServiceToken)
    private readonly transactionApplicationService: ITransactionApplicationService,
    @Inject(LoggerServiceToken)
    private readonly logger: ILoggerService,
  ) {}

  async execute(): Promise<CompanyWithTransfersDto[]> {
    this.logger.log('Starting GetCompaniesWithRecentTransfersUseCase');

    const daysAgo = 30;

    const companyIds =
      await this.transactionApplicationService.getCompanyIdsWithRecentTransfers(
        daysAgo,
      );

    if (companyIds.length === 0) {
      this.logger.log('No companies found with recent transfers');
      return [];
    }

    const [companies, transactionCounts] = await Promise.all([
      this.companyRepository.findByIds(companyIds),
      this.transactionApplicationService.getTransactionCountsByCompanyIds(
        companyIds,
        daysAgo,
      ),
    ]);

    const result = companies.map((company) =>
      CompanyWithTransfersDto.fromEntity(
        company,
        transactionCounts.get(company.id) || 0,
      ),
    );

    this.logger.log(`Found ${result.length} companies with recent transfers`);
    return result;
  }
}
