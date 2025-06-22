import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';

import {
  RegisterCompanyMembershipUseCase,
  GetRecentMembershipsUseCase,
} from '../../../application/use-cases';
import { GetCompaniesWithRecentTransfersUseCase } from '../../../application/use-cases/get-companies-with-recent-transfers.use-case';

import { RegisterMembershipDto } from '../../../application/dto/in/register-membership.dto';
import { MembershipCreatedDto } from '../../../application/dto/out/membership-created.dto';
import { RecentMembershipDto } from 'src/contexts/company/application/dto/out/recent-membership.dto';
import { CompanyWithTransfersDto } from '../../../application/dto/out/company-with-transfers.dto';

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly registerMembershipUseCase: RegisterCompanyMembershipUseCase,
    private readonly getRecentMembershipsUseCase: GetRecentMembershipsUseCase,
    private readonly getCompaniesWithRecentTransfersUseCase: GetCompaniesWithRecentTransfersUseCase,
  ) {}

  @Post('membership')
  @HttpCode(HttpStatus.CREATED)
  async registerMembership(
    @Body() dto: RegisterMembershipDto,
  ): Promise<MembershipCreatedDto> {
    return await this.registerMembershipUseCase.execute(dto);
  }

  @Get('recent-memberships')
  async getRecentMemberships(): Promise<RecentMembershipDto[]> {
    return this.getRecentMembershipsUseCase.execute();
  }

  @Get('with-recent-transfers')
  async getCompaniesWithRecentTransfers(): Promise<CompanyWithTransfersDto[]> {
    return this.getCompaniesWithRecentTransfersUseCase.execute();
  }
}
