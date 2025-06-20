import { Company } from '../../../domain/entities/company.entity';
import { Membership } from '../../../domain/entities/membership.entity';
import { CompanyType } from '../../../domain/enums/company-type.enum';
import { MembershipStatus } from '../../../domain/enums/membership-status.enum';

export class MembershipCreatedDto {
  companyId: string;
  companyName: string;
  companyType: CompanyType;
  membershipId: string;
  membershipStatus: MembershipStatus;
  message: string;

  constructor(
    companyId: string,
    companyName: string,
    companyType: CompanyType,
    membershipId: string,
    membershipStatus: MembershipStatus,
    message: string,
  ) {
    this.companyId = companyId;
    this.companyName = companyName;
    this.companyType = companyType;
    this.membershipId = membershipId;
    this.membershipStatus = membershipStatus;
    this.message = message;
  }

  static fromEntities(
    company: Company,
    membership: Membership,
  ): MembershipCreatedDto {
    return new MembershipCreatedDto(
      company.id,
      company.name,
      company.type,
      membership.id,
      membership.status,
      `Company "${company.name}" registered successfully with membership status: ${membership.status}`,
    );
  }
}
