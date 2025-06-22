import { DataSource } from 'typeorm';
import { CompanyOrmEntity } from '../../contexts/company/infra/persistence/entities/company-orm.entity';
import { MembershipOrmEntity } from '../../contexts/company/infra/persistence/entities/membership-orm.entity';
import { TransactionOrmEntity } from '../../contexts/transaction/infra/persistence/entities/transaction-orm.entity';
import { CompanyType } from '../../contexts/company/domain/enums/company-type.enum';
import { MembershipStatus } from '../../contexts/company/domain/enums/membership-status.enum';
import { TransactionType } from '../../contexts/transaction/domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../contexts/transaction/domain/enums/transaction-status.enum';

export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  async seed(): Promise<void> {
    console.log('🌱 Starting database seeding...');

    try {
      await this.clearDatabase();

      // Create test data
      const companies = await this.createCompanies();
      const memberships = await this.createMemberships(companies);
      const transactions = await this.createTransactions(companies);

      console.log('✅ Seeding completed successfully!');
      console.log(`📊 Data created:`);
      console.log(`   - ${companies.length} companies`);
      console.log(`   - ${memberships.length} memberships`);
      console.log(`   - ${transactions.length} transactions`);

      await this.printTestingInfo(companies, memberships, transactions);
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }

  private async clearDatabase(): Promise<void> {
    console.log('🧹 Clearing database...');

    const transactionRepo = this.dataSource.getRepository(TransactionOrmEntity);
    const membershipRepo = this.dataSource.getRepository(MembershipOrmEntity);
    const companyRepo = this.dataSource.getRepository(CompanyOrmEntity);

    await transactionRepo.createQueryBuilder().delete().execute();
    await membershipRepo.createQueryBuilder().delete().execute();
    await companyRepo.createQueryBuilder().delete().execute();
  }

  private async createCompanies(): Promise<CompanyOrmEntity[]> {
    console.log('🏢 Creating companies...');

    const companyRepo = this.dataSource.getRepository(CompanyOrmEntity);

    const companiesData = [
      // Companies with recent memberships (last 30 days)
      {
        name: 'TechCorp Argentina',
        cuit: '20-12345678-9',
        type: CompanyType.CORPORATE,
        active: true,
        createdAt: this.getDateDaysAgo(5),
      },
      {
        name: 'PyME Solutions SRL',
        cuit: '20-98765432-1',
        type: CompanyType.PYME,
        active: true,
        createdAt: this.getDateDaysAgo(15),
      },
      {
        name: 'Digital Ventures SA',
        cuit: '20-45678912-3',
        type: CompanyType.CORPORATE,
        active: true,
        createdAt: this.getDateDaysAgo(25),
      },

      // Companies with older memberships (more than 30 days)
      {
        name: 'Legacy Systems Corp',
        cuit: '20-78912345-6',
        type: CompanyType.CORPORATE,
        active: true,
        createdAt: this.getDateDaysAgo(45),
      },
      {
        name: 'Startup Inc',
        cuit: '20-32165498-7',
        type: CompanyType.PYME,
        active: true,
        createdAt: this.getDateDaysAgo(60),
      },

      // Companies to test recent transfers
      {
        name: 'Tech Buenos Aires',
        cuit: '20-65432198-7',
        type: CompanyType.CORPORATE,
        active: true,
        createdAt: this.getDateDaysAgo(90),
      },
      {
        name: 'Digital Commerce SA',
        cuit: '20-14725836-9',
        type: CompanyType.PYME,
        active: true,
        createdAt: this.getDateDaysAgo(120),
      },

      // Inactive company
      {
        name: 'Inactive Company SA',
        cuit: '20-96385274-1',
        type: CompanyType.CORPORATE,
        active: false,
        createdAt: this.getDateDaysAgo(180),
      },
    ];

    const companies: CompanyOrmEntity[] = [];

    for (const data of companiesData) {
      const company = companyRepo.create();

      company.name = data.name;
      company.cuit = data.cuit;
      company.type = data.type;
      company.active = data.active;
      company.createdAt = data.createdAt;
      company.updatedAt = data.createdAt;

      companies.push(await companyRepo.save(company));
    }

    return companies;
  }

  private async createMemberships(
    companies: CompanyOrmEntity[],
  ): Promise<MembershipOrmEntity[]> {
    console.log('🎫 Creating memberships...');

    const membershipRepo = this.dataSource.getRepository(MembershipOrmEntity);
    const memberships: MembershipOrmEntity[] = [];

    // Memberships for first 3 companies (recent - last 30 days)
    for (let i = 0; i < 3; i++) {
      const company = companies[i];
      const membership = membershipRepo.create();

      // Assign properties according to domain entity
      membership.companyId = company.id;
      membership.type = company.type; // Use company type
      membership.status = MembershipStatus.ACTIVE;
      membership.requestDate = this.getDateDaysAgo(5 + i * 10);
      membership.approvalDate = this.getDateDaysAgo(3 + i * 10); // Approved a few days later
      membership.approvedBy = 'system-admin';

      memberships.push(await membershipRepo.save(membership));
    }

    // Older memberships for the rest
    for (let i = 3; i < companies.length; i++) {
      const company = companies[i];
      const membership = membershipRepo.create();

      // Assign properties according to domain entity
      membership.companyId = company.id;
      membership.type = company.type;
      membership.status =
        i === 7 ? MembershipStatus.INACTIVE : MembershipStatus.ACTIVE; // Company 8 inactive
      membership.requestDate = this.getDateDaysAgo(45 + i * 15);

      // Only active ones have approval date
      if (i !== 7) {
        membership.approvalDate = this.getDateDaysAgo(40 + i * 15);
        membership.approvedBy = 'system-admin';
      }

      memberships.push(await membershipRepo.save(membership));
    }

    return memberships;
  }

  private async createTransactions(
    companies: CompanyOrmEntity[],
  ): Promise<TransactionOrmEntity[]> {
    console.log('💸 Creating transactions...');

    const transactionRepo = this.dataSource.getRepository(TransactionOrmEntity);
    const transactions: TransactionOrmEntity[] = [];

    // Companies with recent transfers (last 30 days)
    // TechCorp, PyME Solutions, Tech, Digital Commerce
    const companiesWithRecentTransfers = [0, 1, 5, 6];

    for (const companyIndex of companiesWithRecentTransfers) {
      const company = companies[companyIndex];

      // Create multiple transfers per company
      const transferCount = Math.floor(Math.random() * 5) + 2; // 2-6 transfers

      for (let i = 0; i < transferCount; i++) {
        // Recent transfers
        const transfer = transactionRepo.create();

        transfer.companyId = company.id;
        transfer.type = TransactionType.TRANSFER;
        transfer.amount = Math.floor(Math.random() * 100000) + 10000; // 10k - 110k
        transfer.description = `Transfer ${i + 1} from ${company.name}`;
        transfer.status = TransactionStatus.APPROVED;
        transfer.createdAt = this.getDateDaysAgo(
          Math.floor(Math.random() * 30) + 1,
        ); // 1-30 days ago
        transfer.updatedAt = this.getDateDaysAgo(
          Math.floor(Math.random() * 30) + 1,
        );

        transactions.push(await transactionRepo.save(transfer));
      }

      // Add some transactions that are NOT transfers (to test filters)
      const deposit = transactionRepo.create();

      deposit.companyId = company.id;
      deposit.type = TransactionType.DEPOSIT;
      deposit.amount = 50000;
      deposit.description = `Deposit from ${company.name}`;
      deposit.status = TransactionStatus.APPROVED;
      deposit.createdAt = this.getDateDaysAgo(
        Math.floor(Math.random() * 15) + 1,
      );
      deposit.updatedAt = this.getDateDaysAgo(
        Math.floor(Math.random() * 15) + 1,
      );

      transactions.push(await transactionRepo.save(deposit));
    }

    // Create old transfers for other companies (more than 30 days ago)
    for (let i = 2; i < 5; i++) {
      const company = companies[i];

      const oldTransfer = transactionRepo.create();

      oldTransfer.companyId = company.id;
      oldTransfer.type = TransactionType.TRANSFER;
      oldTransfer.amount = 75000;
      oldTransfer.description = `Old transfer from ${company.name}`;
      oldTransfer.status = TransactionStatus.APPROVED;
      oldTransfer.createdAt = this.getDateDaysAgo(
        45 + Math.floor(Math.random() * 30),
      ); // 45-75 days ago
      oldTransfer.updatedAt = this.getDateDaysAgo(
        45 + Math.floor(Math.random() * 30),
      );

      transactions.push(await transactionRepo.save(oldTransfer));
    }

    return transactions;
  }

  private async printTestingInfo(
    companies: CompanyOrmEntity[],
    memberships: MembershipOrmEntity[],
    transactions: TransactionOrmEntity[],
  ): Promise<void> {
    console.log('\n📋 TESTING INFORMATION:');
    console.log('='.repeat(50));

    // Companies with recent memberships
    const recentMemberships = memberships.filter((m) =>
      this.isWithinDays(m.requestDate, 30),
    );

    console.log(
      `\n🔵 Companies with recent memberships (last 30 days): ${recentMemberships.length}`,
    );
    recentMemberships.forEach((m) => {
      const company = companies.find((c) => c.id === m.companyId);
      console.log(
        `   - ${company?.name} (${company?.cuit}) - ${this.formatDate(m.requestDate)}`,
      );
    });

    // Companies with recent transfers
    const recentTransfers = transactions.filter(
      (t) =>
        t.type === TransactionType.TRANSFER &&
        this.isWithinDays(t.createdAt, 30),
    );

    const companiesWithTransfers = [
      ...new Set(recentTransfers.map((t) => t.companyId)),
    ];

    console.log(
      `\n💸 Companies with recent transfers (last 30 days): ${companiesWithTransfers.length}`,
    );
    companiesWithTransfers.forEach((companyId) => {
      const company = companies.find((c) => c.id === companyId);
      const transferCount = recentTransfers.filter(
        (t) => t.companyId === companyId,
      ).length;
      console.log(
        `   - ${company?.name} (${company?.cuit}) - ${transferCount} transfers`,
      );
    });
  }

  private getDateDaysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  }

  private isWithinDays(date: Date, days: number): boolean {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-AR');
  }
}

export async function runSeed(): Promise<void> {
  const { DataSource } = await import('typeorm');

  const dataSource = new DataSource({
    type: 'sqlite',
    database: './data/db-companies.sqlite',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
  });

  try {
    await dataSource.initialize();
    console.log('📁 Database connection established');

    const seeder = new DatabaseSeeder(dataSource);
    await seeder.seed();
  } catch (error) {
    console.error('❌ Error running seed:', error);
  } finally {
    await dataSource.destroy();
    console.log('🔌 Connection closed');
  }
}

runSeed().catch(console.error);
