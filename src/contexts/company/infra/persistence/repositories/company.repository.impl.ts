import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager } from 'typeorm';

import { Company } from '../../../domain/entities/company.entity';
import { CompanyRepository } from '../../../domain/repositories/company.repository';
import { CompanyOrmEntity } from '../entities/company-orm.entity';
import { RepositoryOperationFailedError } from '../../exceptions/repository.exceptions';

@Injectable()
export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyOrmEntity)
    private readonly repository: Repository<CompanyOrmEntity>,
  ) {}

  async save(company: Company, manager?: EntityManager): Promise<void> {
    try {
      const repo = manager
        ? manager.getRepository(CompanyOrmEntity)
        : this.repository;

      const ormEntity = CompanyOrmEntity.fromDomain(company);
      await repo.save(ormEntity);
    } catch (error) {
      throw new RepositoryOperationFailedError(
        'save',
        'Company',
        error.message,
      );
    }
  }

  async findById(id: string): Promise<Company | null> {
    try {
      const ormEntity = await this.repository.findOne({ where: { id } });
      return ormEntity ? ormEntity.toDomain() : null;
    } catch (error) {
      throw new RepositoryOperationFailedError(
        'findById',
        'Company',
        error.message,
      );
    }
  }

  async findByIds(ids: string[]): Promise<Company[]> {
    if (ids.length === 0) return [];

    try {
      const ormEntities = await this.repository.find({
        where: { id: In(ids) },
      });
      return ormEntities.map((orm) => orm.toDomain());
    } catch (error) {
      throw new RepositoryOperationFailedError(
        'findByIds',
        'Company',
        error.message,
      );
    }
  }

  async findByCuit(cuit: string): Promise<Company | null> {
    try {
      const ormEntity = await this.repository.findOne({ where: { cuit } });
      return ormEntity ? ormEntity.toDomain() : null;
    } catch (error) {
      throw new RepositoryOperationFailedError(
        'findByCuit',
        'Company',
        error.message,
      );
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      const ormEntities = await this.repository.find();
      return ormEntities.map((orm) => orm.toDomain());
    } catch (error) {
      throw new RepositoryOperationFailedError(
        'findAll',
        'Company',
        error.message,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw new RepositoryOperationFailedError(
        'delete',
        'Company',
        error.message,
      );
    }
  }
}
