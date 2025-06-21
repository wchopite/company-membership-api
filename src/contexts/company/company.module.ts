import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Domain
import { CompanyRepositoryToken } from './domain/repositories/company.repository';
import { MembershipRepositoryToken } from './domain/repositories/membership.repository';

// Application - Use Cases
import {
  RegisterCompanyMembershipUseCase,
  GetRecentMembershipsUseCase,
} from './application/use-cases';
import { GetCompaniesWithRecentTransfersUseCase } from './application/use-cases/get-companies-with-recent-transfers.use-case';

// Infrastructure - Implementations
import { CompanyOrmEntity } from './infra/persistence/entities/company-orm.entity';
import { MembershipOrmEntity } from './infra/persistence/entities/membership-orm.entity';
import { CompanyRepositoryImpl } from './infra/persistence/repositories/company.repository.impl';
import { MembershipRepositoryImpl } from './infra/persistence/repositories/membership.repository.impl';
import { CompanyController } from './infra/api/controllers/company.controller';

// Module Imports
import { SharedServicesModule } from '../../shared/services/services.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyOrmEntity, MembershipOrmEntity]),
    SharedServicesModule,
    TransactionModule,
  ],
  controllers: [CompanyController],
  providers: [
    {
      provide: CompanyRepositoryToken,
      useClass: CompanyRepositoryImpl,
    },
    {
      provide: MembershipRepositoryToken,
      useClass: MembershipRepositoryImpl,
    },
    RegisterCompanyMembershipUseCase,
    GetRecentMembershipsUseCase,
    GetCompaniesWithRecentTransfersUseCase,
  ],
  exports: [
    CompanyRepositoryToken,
    MembershipRepositoryToken,
    RegisterCompanyMembershipUseCase,
    GetRecentMembershipsUseCase,
    GetCompaniesWithRecentTransfersUseCase,
  ],
})
export class CompanyModule {}
