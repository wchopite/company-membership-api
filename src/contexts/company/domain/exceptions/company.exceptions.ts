export class CompanyAlreadyActiveError extends Error {
  constructor(companyId: string) {
    super(`Company ${companyId} is already active`);
    this.name = 'CompanyAlreadyActiveError';
  }
}

export class CompanyAlreadyInactiveError extends Error {
  constructor(companyId: string) {
    super(`Company ${companyId} is already inactive`);
    this.name = 'CompanyAlreadyInactiveError';
  }
}

export class CompanyWithCuitAlreadyExistsError extends Error {
  constructor(cuit: string) {
    super(`Company with CUIT ${cuit} already exists`);
    this.name = 'CompanyWithCuitAlreadyExistsError';
  }
}

export class CompanyNameRequiredError extends Error {
  constructor() {
    super('Company name is required');
    this.name = 'CompanyNameRequiredError';
  }
}

export class CompanyNameTooShortError extends Error {
  constructor(minLength: number = 2) {
    super(`Company name must be at least ${minLength} characters long`);
    this.name = 'CompanyNameTooShortError';
  }
}

export class CompanyNameTooLongError extends Error {
  constructor(maxLength: number = 100) {
    super(`Company name must not exceed ${maxLength} characters`);
    this.name = 'CompanyNameTooLongError';
  }
}

export class CompanyNameInvalidCharactersError extends Error {
  constructor(invalidName: string) {
    super(`Company name "${invalidName}" contains invalid characters`);
    this.name = 'CompanyNameInvalidCharactersError';
  }
}

export class CuitRequiredError extends Error {
  constructor() {
    super('CUIT is required');
    this.name = 'CuitRequiredError';
  }
}

export class InvalidCuitFormatError extends Error {
  constructor(cuit: string) {
    super(`CUIT "${cuit}" must be in the format XX-XXXXXXXX-X`);
    this.name = 'InvalidCuitFormatError';
  }
}

export class InvalidCuitError extends Error {
  constructor(cuit: string, reason?: string) {
    const message = reason
      ? `Invalid CUIT "${cuit}": ${reason}`
      : `Invalid CUIT "${cuit}"`;
    super(message);
    this.name = 'InvalidCuitError';
  }
}

export class CompanyIdRequiredError extends Error {
  constructor() {
    super('Company ID is required');
    this.name = 'CompanyIdRequiredError';
  }
}

export class InvalidCompanyIdError extends Error {
  constructor(id: string) {
    super(`Invalid company ID format: "${id}"`);
    this.name = 'InvalidCompanyIdError';
  }
}
