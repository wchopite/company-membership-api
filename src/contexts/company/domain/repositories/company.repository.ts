import { Company } from '../entities/company.entity';

export const CompanyRepositoryToken = Symbol('CompanyRepository');

export interface CompanyRepository {
  save(company: Company): Promise<void>;
  findById(id: string): Promise<Company | null>;
  findByCuit(cuit: string): Promise<Company | null>;
  findByIds(ids: string[]): Promise<Company[]>;
  findAll(): Promise<Company[]>;
  delete(id: string): Promise<void>;
}
