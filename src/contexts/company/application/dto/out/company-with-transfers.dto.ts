import { Company } from '../../../domain/entities/company.entity';
import { CompanyType } from '../../../domain/enums/company-type.enum';

export class CompanyWithTransfersDto {
  id: string;
  name: string;
  cuit: string;
  type: CompanyType;
  active: boolean;
  transactionCount: number;
  createdAt: Date;

  constructor(
    id: string,
    name: string,
    cuit: string,
    type: CompanyType,
    active: boolean,
    transactionCount: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.cuit = cuit;
    this.type = type;
    this.active = active;
    this.transactionCount = transactionCount;
    this.createdAt = createdAt;
  }

  static fromEntity(
    company: Company,
    transactionCount: number,
  ): CompanyWithTransfersDto {
    return new CompanyWithTransfersDto(
      company.id,
      company.name,
      company.cuit,
      company.type,
      company.active,
      transactionCount,
      company.createdAt,
    );
  }

  static fromEntities(
    companies: Company[],
    transactionCounts: Map<string, number>,
  ): CompanyWithTransfersDto[] {
    return companies.map((company) =>
      this.fromEntity(company, transactionCounts.get(company.id) || 0),
    );
  }
}
