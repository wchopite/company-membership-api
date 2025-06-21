import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepositoryToken } from './domain/repositories/transaction.repository';
import { TransactionApplicationServiceToken } from './application/services/interfaces/transaction-application.service.interface';
import { TransactionOrmEntity } from './infra/persistence/entities/transaction-orm.entity';
import { TransactionRepositoryImpl } from './infra/persistence/repositories/transaction.repository.impl';
import { TransactionApplicationService } from './application/services/transaction-application.service';
import { SharedServicesModule } from '../../shared/services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionOrmEntity]),
    SharedServicesModule,
  ],
  providers: [
    {
      provide: TransactionRepositoryToken,
      useClass: TransactionRepositoryImpl,
    },
    {
      provide: TransactionApplicationServiceToken,
      useClass: TransactionApplicationService,
    },
  ],
  exports: [TransactionApplicationServiceToken],
})
export class TransactionModule {}
