import { Injectable, Inject } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { DATABASE_CONNECTION_TOKEN } from './database.tokens';

@Injectable()
export class TransactionManager {
  constructor(
    @Inject(DATABASE_CONNECTION_TOKEN) private readonly dataSource: DataSource,
  ) {}

  async execute<T>(
    operation: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
