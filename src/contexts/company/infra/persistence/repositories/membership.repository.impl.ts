import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, EntityManager } from 'typeorm';

import { Membership } from '../../../domain/entities/membership.entity';
import { MembershipRepository } from '../../../domain/repositories/membership.repository';
import { MembershipStatus } from '../../../domain/enums/membership-status.enum';
import { MembershipOrmEntity } from '../entities/membership-orm.entity';
import { RepositoryOperationFailedError } from '../../exceptions/repository.exceptions';

@Injectable()
export class MembershipRepositoryImpl implements MembershipRepository {
  constructor(
    @InjectRepository(MembershipOrmEntity)
    private readonly ormRepository: Repository<MembershipOrmEntity>,
  ) {}

  async save(membership: Membership, manager?: EntityManager): Promise<void> {
    try {
      const repo = manager
        ? manager.getRepository(MembershipOrmEntity)
        : this.ormRepository;

      const ormEntity = this.mapToOrmEntity(membership);
      await repo.save(ormEntity);
    } catch (error) {
      throw new RepositoryOperationFailedError(
        'save',
        'Membership',
        error.message,
      );
    }
  }

  async findById(id: string): Promise<Membership | null> {
    try {
      const ormEntity = await this.ormRepository.findOne({ where: { id } });
      return ormEntity ? this.mapToDomainEntity(ormEntity) : null;
    } catch (error) {
      throw new RepositoryOperationFailedError(
        'findById',
        'Membership',
        error.message,
      );
    }
  }

  async findByCompanyId(companyId: string): Promise<Membership[]> {
    try {
      const ormEntities = await this.ormRepository.find({
        where: { companyId },
        order: { requestDate: 'DESC' },
      });
      return ormEntities.map((orm) => this.mapToDomainEntity(orm));
    } catch (error) {
      throw new RepositoryOperationFailedError(
        'findByCompanyId',
        'Membership',
        error.message,
      );
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Membership[]> {
    try {
      const ormEntities = await this.ormRepository.find({
        where: {
          requestDate: Between(startDate, endDate),
        },
        order: { requestDate: 'DESC' },
      });
      return ormEntities.map((orm) => this.mapToDomainEntity(orm));
    } catch (error) {
      throw new RepositoryOperationFailedError(
        'findByDateRange',
        'Membership',
        error.message,
      );
    }
  }

  async findByStatus(status: MembershipStatus): Promise<Membership[]> {
    try {
      const ormEntities = await this.ormRepository.find({
        where: { status },
        order: { requestDate: 'DESC' },
      });
      return ormEntities.map((orm) => this.mapToDomainEntity(orm));
    } catch (error) {
      throw new RepositoryOperationFailedError(
        'findByStatus',
        'Membership',
        error.message,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.ormRepository.delete(id);
    } catch (error) {
      throw new RepositoryOperationFailedError(
        'delete',
        'Membership',
        error.message,
      );
    }
  }

  private mapToOrmEntity(membership: Membership): MembershipOrmEntity {
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

  private mapToDomainEntity(ormEntity: MembershipOrmEntity): Membership {
    return Membership.reconstruct({
      id: ormEntity.id,
      companyId: ormEntity.companyId,
      type: ormEntity.type,
      status: ormEntity.status,
      requestDate: ormEntity.requestDate,
      approvalDate: ormEntity.approvalDate,
      approvedBy: ormEntity.approvedBy,
    });
  }
}
