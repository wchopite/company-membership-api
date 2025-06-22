import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { TransactionRepository } from '../../../domain/repositories/transaction.repository';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { TransactionOrmEntity } from '../entities/transaction-orm.entity';
import { TransactionRepositoryError } from '../../../domain/exceptions/transaction.exceptions';
import { TransactionType } from '../../../domain/enums';

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly ormRepository: Repository<TransactionOrmEntity>,
  ) {}

  async findCompaniesByRecentTransactions(daysAgo: number): Promise<string[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      const result = await this.ormRepository
        .createQueryBuilder('transaction')
        .select('DISTINCT transaction.companyId', 'companyId')
        .where('transaction.createdAt >= :cutoffDate', { cutoffDate })
        .andWhere('transaction.type = :type', {
          type: TransactionType.TRANSFER,
        })
        .getRawMany();

      return result.map((row) => row.companyId);
    } catch (error) {
      throw new TransactionRepositoryError(
        'findCompaniesByRecentTransactions',
        error,
      );
    }
  }

  async findRecentByCompanyIds(
    companyIds: string[],
    daysAgo: number,
  ): Promise<Transaction[]> {
    try {
      if (companyIds.length === 0) {
        return [];
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      const ormEntities = await this.ormRepository
        .createQueryBuilder('transaction')
        .where('transaction.companyId IN (:...companyIds)', { companyIds })
        .andWhere('transaction.createdAt >= :cutoffDate', { cutoffDate })
        .orderBy('transaction.createdAt', 'DESC')
        .getMany();

      return ormEntities.map((entity) => entity.toDomain());
    } catch (error) {
      throw new TransactionRepositoryError('findRecentByCompanyIds', error);
    }
  }

  async findByCompanyId(companyId: string): Promise<Transaction[]> {
    try {
      const ormEntities = await this.ormRepository.find({
        where: { companyId },
        order: { createdAt: 'DESC' },
      });

      return ormEntities.map((entity) => entity.toDomain());
    } catch (error) {
      throw new TransactionRepositoryError('findByCompanyId', error);
    }
  }

  async save(
    transaction: Transaction,
    manager?: EntityManager,
  ): Promise<Transaction> {
    try {
      const ormEntity = TransactionOrmEntity.fromDomain(transaction);

      const repository = manager
        ? manager.getRepository(TransactionOrmEntity)
        : this.ormRepository;
      const savedEntity = await (repository as any).save(ormEntity);

      return savedEntity.toDomain();
    } catch (error) {
      throw new TransactionRepositoryError('save', error);
    }
  }

  async findById(id: string): Promise<Transaction | null> {
    try {
      const ormEntity = await this.ormRepository.findOne({ where: { id } });
      return ormEntity ? ormEntity.toDomain() : null;
    } catch (error) {
      throw new TransactionRepositoryError('findById', error);
    }
  }

  async countByCompanyIds(
    companyIds: string[],
    daysAgo: number,
  ): Promise<Map<string, number>> {
    try {
      if (companyIds.length === 0) {
        return new Map();
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

      const result = await this.ormRepository
        .createQueryBuilder('transaction')
        .select('transaction.companyId', 'companyId')
        .addSelect('COUNT(*)', 'count')
        .where('transaction.companyId IN (:...companyIds)', { companyIds })
        .andWhere('transaction.createdAt >= :cutoffDate', { cutoffDate })
        .andWhere('transaction.type = :type', {
          type: TransactionType.TRANSFER,
        })
        .groupBy('transaction.companyId')
        .getRawMany();

      const countMap = new Map<string, number>();
      result.forEach((row) => {
        countMap.set(row.companyId, parseInt(row.count, 10));
      });

      return countMap;
    } catch (error) {
      throw new TransactionRepositoryError('countByCompanyIds', error);
    }
  }
}
