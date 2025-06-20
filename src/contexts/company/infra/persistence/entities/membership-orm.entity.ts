import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';

import { CompanyType } from '../../../domain/enums/company-type.enum';
import { MembershipStatus } from '../../../domain/enums/membership-status.enum';
import { CompanyOrmEntity } from './company-orm.entity';
import { BaseOrmEntity } from '../../../../../shared/database';
import { Membership } from '../../../domain/entities/membership.entity';

@Entity('memberships')
export class MembershipOrmEntity extends BaseOrmEntity {
  @Column({ name: 'company_id' })
  companyId: string;

  @Column({
    type: 'varchar',
    enum: CompanyType,
  })
  type: CompanyType;

  @Column({
    type: 'varchar',
    enum: MembershipStatus,
    default: MembershipStatus.PENDING,
  })
  status: MembershipStatus;

  @CreateDateColumn({ name: 'request_date' })
  requestDate: Date;

  @Column({ name: 'approval_date', nullable: true })
  approvalDate?: Date;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy?: string;

  @ManyToOne(() => CompanyOrmEntity, (company) => company.memberships)
  @JoinColumn({ name: 'company_id' })
  company: Relation<CompanyOrmEntity>;

  static fromDomain(membership: Membership): MembershipOrmEntity {
    const ormEntity = new MembershipOrmEntity();
    ormEntity.id = membership.id;
    ormEntity.companyId = membership.companyId;
    ormEntity.type = membership.type;
    ormEntity.status = membership.status;
    ormEntity.requestDate = membership.requestDate;
    ormEntity.approvalDate = membership.approvalDate;
    ormEntity.approvedBy = membership.approvedBy;
    return ormEntity;
  }

  toDomain(): Membership {
    return Membership.reconstruct({
      id: this.id,
      companyId: this.companyId,
      type: this.type,
      status: this.status,
      requestDate: this.requestDate,
      approvalDate: this.approvalDate,
      approvedBy: this.approvedBy,
    });
  }

  static fromDomainArray(memberships: Membership[]): MembershipOrmEntity[] {
    return memberships.map((membership) =>
      MembershipOrmEntity.fromDomain(membership),
    );
  }

  static toDomainArray(ormEntities: MembershipOrmEntity[]): Membership[] {
    return ormEntities.map((orm) => orm.toDomain());
  }
}
