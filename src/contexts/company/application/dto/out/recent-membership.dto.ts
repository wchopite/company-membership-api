import { Company } from '../../../domain/entities/company.entity';
import { Membership } from '../../../domain/entities/membership.entity';

export class RecentMembershipDto {
  id: string;
  companyId: string;
  companyName: string;
  companyCuit: string;
  companyType: string;
  membershipType: string;
  membershipStatus: string;
  requestDate: string;
  approvalDate?: string;

  static fromEntities(
    company: Company,
    membership: Membership,
  ): RecentMembershipDto {
    return {
      id: membership.id,
      companyId: company.id,
      companyName: company.name,
      companyCuit: company.cuit,
      companyType: company.type,
      membershipType: membership.type,
      membershipStatus: membership.status,
      requestDate: membership.requestDate.toISOString(),
      approvalDate: membership.approvalDate?.toISOString(),
    };
  }
}
