import { Injectable, Inject } from '@nestjs/common';
import { UseCase } from '../interfaces/use-case.interface';
import { RecentMembershipDto } from '../dto/out/recent-membership.dto';
import {
  MembershipRepository,
  MembershipRepositoryToken,
} from '../../domain/repositories/membership.repository';
import {
  CompanyRepository,
  CompanyRepositoryToken,
} from '../../domain/repositories/company.repository';
import { ILoggerService, LoggerServiceToken } from '../../../../shared/logger';

@Injectable()
export class GetRecentMembershipsUseCase
  implements UseCase<void, RecentMembershipDto[]>
{
  constructor(
    @Inject(MembershipRepositoryToken)
    private readonly membershipRepository: MembershipRepository,
    @Inject(CompanyRepositoryToken)
    private readonly companyRepository: CompanyRepository,
    @Inject(LoggerServiceToken)
    private readonly logger: ILoggerService,
  ) {}

  async execute(): Promise<RecentMembershipDto[]> {
    this.logger.log('Getting recent memberships from last 30 days');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const now = new Date();

    const recentMemberships = await this.membershipRepository.findByDateRange(
      thirtyDaysAgo,
      now,
    );

    if (recentMemberships.length === 0) {
      this.logger.log('No recent memberships found');
      return [];
    }

    const companyIds = [...new Set(recentMemberships.map((m) => m.companyId))];

    const companies = await this.companyRepository.findByIds(companyIds);

    const companiesMap = new Map(companies.map((c) => [c.id, c]));

    const result = recentMemberships
      .map((membership) => {
        const company = companiesMap.get(membership.companyId);
        return company
          ? RecentMembershipDto.fromEntities(company, membership)
          : null;
      })
      .filter(Boolean) as RecentMembershipDto[];

    this.logger.log(`Found ${result.length} recent memberships`);
    return result;
  }
}
