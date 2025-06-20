import { Entity, Column, OneToMany, Relation } from 'typeorm';
import { MembershipOrmEntity } from './membership-orm.entity';
import { CompanyType } from '../../../domain/enums/company-type.enum';
import { BaseOrmEntity } from '../../../../../shared/database';
import { Company } from '../../../domain/entities/company.entity';

@Entity('companies')
export class CompanyOrmEntity extends BaseOrmEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 15 })
  cuit: string;

  @Column({
    type: 'varchar',
    enum: CompanyType,
  })
  type: CompanyType;

  @Column({ default: false })
  active: boolean;

  @OneToMany(() => MembershipOrmEntity, (membership) => membership.company)
  memberships: Relation<MembershipOrmEntity[]>;

  static fromDomain(company: Company): CompanyOrmEntity {
    const ormEntity = new CompanyOrmEntity();
    ormEntity.id = company.id;
    ormEntity.name = company.name;
    ormEntity.cuit = company.cuit;
    ormEntity.type = company.type;
    ormEntity.active = company.active;
    ormEntity.createdAt = company.createdAt;
    return ormEntity;
  }

  toDomain(): Company {
    return Company.reconstruct({
      id: this.id,
      name: this.name,
      cuit: this.cuit,
      type: this.type,
      active: this.active,
      createdAt: this.createdAt,
    });
  }

  static fromDomainArray(companies: Company[]): CompanyOrmEntity[] {
    return companies.map((company) => CompanyOrmEntity.fromDomain(company));
  }

  static toDomainArray(ormEntities: CompanyOrmEntity[]): Company[] {
    return ormEntities.map((orm) => orm.toDomain());
  }
}
