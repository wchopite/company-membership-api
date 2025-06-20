import { Company } from '../../../domain/entities/company.entity';
import { Membership } from '../../../domain/entities/membership.entity';
import { CompanyType } from '../../../domain/enums/company-type.enum';
import { MembershipStatus } from '../../../domain/enums/membership-status.enum';

export class CompanyMembershipDto {
  membershipId: string;
  companyId: string;
  companyName: string;
  companyCuit: string;
  type: CompanyType;
  status: MembershipStatus;
  requestDate: Date;
  approvalDate?: Date;
  approvedBy?: string;

  constructor(
    membershipId: string,
    companyId: string,
    companyName: string,
    companyCuit: string,
    type: CompanyType,
    status: MembershipStatus,
    requestDate: Date,
    approvalDate?: Date,
    approvedBy?: string,
  ) {
    this.membershipId = membershipId;
    this.companyId = companyId;
    this.companyName = companyName;
    this.companyCuit = companyCuit;
    this.type = type;
    this.status = status;
    this.requestDate = requestDate;
    this.approvalDate = approvalDate;
    this.approvedBy = approvedBy;
  }

  static fromEntities(
    membership: Membership,
    company: Company,
  ): CompanyMembershipDto {
    return new CompanyMembershipDto(
      membership.id,
      company.id,
      company.name,
      company.cuit,
      membership.type,
      membership.status,
      membership.requestDate,
      membership.approvalDate,
      membership.approvedBy,
    );
  }

  static fromEntitiesArray(
    memberships: Membership[],
    companies: Company[],
  ): CompanyMembershipDto[] {
    return memberships.map((membership) => {
      const company = companies.find((c) => c.id === membership.companyId);

      if (!company) {
        throw new Error(`Company not found for membership ${membership.id}`);
      }

      return this.fromEntities(membership, company);
    });
  }
}
