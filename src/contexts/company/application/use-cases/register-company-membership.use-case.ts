import { Injectable, Inject } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import { Membership } from '../../domain/entities/membership.entity';
import { CompanyWithCuitAlreadyExistsError } from '../../domain/exceptions/company.exceptions';
import {
  CompanyRepository,
  CompanyRepositoryToken,
} from '../../domain/repositories/company.repository';
import {
  MembershipRepository,
  MembershipRepositoryToken,
} from '../../domain/repositories/membership.repository';
import {
  IdGeneratorService,
  IdGeneratorServiceToken,
} from '../../../../shared/services/domain/id-generator.service';

import { RegisterMembershipDto } from '../dto/in/register-membership.dto';
import { MembershipCreatedDto } from '../dto/out/membership-created.dto';

import { UseCase } from '../interfaces/use-case.interface';

import {
  ILoggerService,
  LOGGER_SERVICE_TOKEN,
} from '../../../../shared/logger';
import { TransactionManager } from 'src/shared/database/database.transaction-manager';

@Injectable()
export class RegisterCompanyMembershipUseCase
  implements UseCase<RegisterMembershipDto, MembershipCreatedDto>
{
  constructor(
    private readonly transactionManager: TransactionManager,
    @Inject(LOGGER_SERVICE_TOKEN)
    private readonly logger: ILoggerService,
    @Inject(CompanyRepositoryToken)
    private readonly companyRepository: CompanyRepository,
    @Inject(MembershipRepositoryToken)
    private readonly membershipRepository: MembershipRepository,
    @Inject(IdGeneratorServiceToken)
    private readonly idGenerator: IdGeneratorService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute(dto: RegisterMembershipDto): Promise<MembershipCreatedDto> {
    const existingCompany = await this.companyRepository.findByCuit(dto.cuit);
    if (existingCompany) {
      throw new CompanyWithCuitAlreadyExistsError(dto.cuit);
    }

    const companyId = this.idGenerator.generate();
    const membershipId = this.idGenerator.generate();

    const company = new Company(companyId, dto.name, dto.cuit, dto.type);
    const membership = new Membership(membershipId, company.id, dto.type);

    await this.transactionManager.execute(async (manager) => {
      await (this.companyRepository as any).save(company, manager);
      await (this.membershipRepository as any).save(membership, manager);
    });

    this.logger.log('Company membership registered', {
      companyId,
      membershipId,
      cuit: dto.cuit,
    });

    return MembershipCreatedDto.fromEntities(company, membership);
  }
}
