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

// Infrastructure - Implementations
import { CompanyOrmEntity } from './infra/persistence/entities/company-orm.entity';
import { MembershipOrmEntity } from './infra/persistence/entities/membership-orm.entity';
import { CompanyRepositoryImpl } from './infra/persistence/repositories/company.repository.impl';
import { MembershipRepositoryImpl } from './infra/persistence/repositories/membership.repository.impl';
import { CompanyController } from './infra/api/controllers/company.controller';

// Module Imports
import { SharedServicesModule } from '../../shared/services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyOrmEntity, MembershipOrmEntity]),
    SharedServicesModule,
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
  ],
  exports: [
    CompanyRepositoryToken,
    MembershipRepositoryToken,
    RegisterCompanyMembershipUseCase,
    GetRecentMembershipsUseCase,
  ],
})
export class CompanyModule {}
