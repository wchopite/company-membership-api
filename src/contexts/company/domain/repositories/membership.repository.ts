import { Membership } from '../entities/membership.entity';
import { MembershipStatus } from '../enums/membership-status.enum';

export const MembershipRepositoryToken = Symbol('MembershipRepository');

export interface MembershipRepository {
  save(membership: Membership): Promise<void>;
  findById(id: string): Promise<Membership | null>;
  findByCompanyId(companyId: string): Promise<Membership[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Membership[]>;
  findByStatus(status: MembershipStatus): Promise<Membership[]>;
  delete(id: string): Promise<void>;
}
