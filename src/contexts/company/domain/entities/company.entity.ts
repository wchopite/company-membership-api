import { CompanyType } from '../enums/company-type.enum';
import {
  CompanyAlreadyActiveError,
  CompanyAlreadyInactiveError,
  CompanyNameRequiredError,
  CompanyNameTooShortError,
  CompanyNameTooLongError,
  CompanyNameInvalidCharactersError,
  CuitRequiredError,
  InvalidCuitFormatError,
  CompanyIdRequiredError,
} from '../exceptions/company.exceptions';

interface ReconstructCompanyData {
  id: string;
  name: string;
  cuit: string;
  type: CompanyType;
  active: boolean;
  createdAt: Date;
}

export class Company {
  private _id: string;
  private _name: string;
  private _cuit: string;
  private _type: CompanyType;
  private _active: boolean;
  private _createdAt: Date;

  constructor(id: string, name: string, cuit: string, type: CompanyType) {
    this.validateId(id);
    this.validateName(name);
    this.validateCuit(cuit);

    this._id = id;
    this._name = name.trim();
    this._cuit = cuit.trim();
    this._type = type;
    this._active = false;
    this._createdAt = new Date();
  }

  static reconstruct(data: ReconstructCompanyData): Company {
    const company = Object.create(Company.prototype);
    company._id = data.id;
    company._name = data.name;
    company._cuit = data.cuit;
    company._type = data.type;
    company._active = data.active;
    company._createdAt = data.createdAt;
    return company;
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get cuit(): string {
    return this._cuit;
  }
  get type(): CompanyType {
    return this._type;
  }
  get active(): boolean {
    return this._active;
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  activate(): void {
    if (this._active) {
      throw new CompanyAlreadyActiveError(this._id);
    }
    this._active = true;
  }

  deactivate(): void {
    if (!this._active) {
      throw new CompanyAlreadyInactiveError(this._id);
    }
    this._active = false;
  }

  updateName(newName: string): void {
    this.validateName(newName);
    this._name = newName.trim();
  }

  isPyme(): boolean {
    return this._type === CompanyType.PYME;
  }

  isCorporate(): boolean {
    return this._type === CompanyType.CORPORATE;
  }

  canPerformTransactions(): boolean {
    return this._active;
  }

  getDisplayName(): string {
    return `${this._name} (${this._cuit})`;
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new CompanyIdRequiredError();
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new CompanyNameRequiredError();
    }

    if (name.trim().length < 2) {
      throw new CompanyNameTooShortError(2);
    }

    if (name.trim().length > 100) {
      throw new CompanyNameTooLongError(100);
    }

    const nameRegex = /^[a-zA-ZÀ-ÿ0-9\s.\-&,°ª()]+$/;
    if (!nameRegex.test(name.trim())) {
      throw new CompanyNameInvalidCharactersError(name.trim());
    }
  }

  private validateCuit(cuit: string): void {
    if (!cuit || cuit.trim().length === 0) {
      throw new CuitRequiredError();
    }

    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuitRegex.test(cuit.trim())) {
      throw new InvalidCuitFormatError(cuit.trim());
    }
  }
}
