import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { TransactionType, TransactionStatus } from '../../../domain/enums';
import { CompanyOrmEntity } from '../../../../company/infra/persistence/entities/company-orm.entity';
import { BaseOrmEntity } from '../../../../../shared/database/base-orm.entity';

@Entity('transactions')
export class TransactionOrmEntity extends BaseOrmEntity {
  @Column({ name: 'company_id' })
  companyId: string;

  @Column({
    type: 'varchar',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ length: 500 })
  description: string;

  @Column({
    type: 'varchar',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @ManyToOne(() => CompanyOrmEntity)
  @JoinColumn({ name: 'company_id' })
  company: CompanyOrmEntity;

  static fromDomain(transaction: Transaction): TransactionOrmEntity {
    const ormEntity = new TransactionOrmEntity();
    ormEntity.id = transaction.id;
    ormEntity.companyId = transaction.companyId;
    ormEntity.type = transaction.type;
    ormEntity.amount = transaction.amount;
    ormEntity.description = transaction.description;
    ormEntity.status = transaction.status;
    ormEntity.createdAt = transaction.createdAt;
    ormEntity.updatedAt = transaction.updatedAt;
    return ormEntity;
  }

  toDomain(): Transaction {
    return Transaction.reconstruct(
      this.id,
      this.companyId,
      this.type,
      this.amount,
      this.description,
      this.status,
      this.createdAt,
      this.updatedAt,
    );
  }
}
