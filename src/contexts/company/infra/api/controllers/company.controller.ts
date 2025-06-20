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

import { RegisterMembershipDto } from '../../../application/dto/in/register-membership.dto';
import { MembershipCreatedDto } from '../../../application/dto/out/membership-created.dto';
import { RecentMembershipDto } from 'src/contexts/company/application/dto/out/recent-membership.dto';

@Controller('companies')
export class CompanyController {
  constructor(
    private readonly registerMembershipUseCase: RegisterCompanyMembershipUseCase,
    private readonly getRecentMembershipsUseCase: GetRecentMembershipsUseCase,
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
}
