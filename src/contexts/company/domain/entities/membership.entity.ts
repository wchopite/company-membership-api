import { CompanyType } from '../enums/company-type.enum';
import { MembershipStatus } from '../enums/membership-status.enum';
import {
  MembershipCannotBeApprovedError,
  MembershipCannotBeRejectedError,
  MembershipIdRequiredError,
  CompanyIdRequiredError,
  UserIdRequiredForApprovalError,
} from '../exceptions/membership.exceptions';

interface ReconstructMembershipData {
  id: string;
  companyId: string;
  type: CompanyType;
  status: MembershipStatus;
  requestDate: Date;
  approvalDate?: Date;
  approvedBy?: string;
}

export class Membership {
  private _id: string;
  private _companyId: string;
  private _type: CompanyType;
  private _status: MembershipStatus;
  private _requestDate: Date;
  private _approvalDate?: Date;
  private _approvedBy?: string;

  constructor(id: string, companyId: string, type: CompanyType) {
    this.validateId(id);
    this.validateCompanyId(companyId);

    this._id = id;
    this._companyId = companyId;
    this._type = type;
    this._status = MembershipStatus.PENDING;
    this._requestDate = new Date();
  }

  static reconstruct(data: ReconstructMembershipData): Membership {
    const membership = Object.create(Membership.prototype);
    membership._id = data.id;
    membership._companyId = data.companyId;
    membership._type = data.type;
    membership._status = data.status;
    membership._requestDate = data.requestDate;
    membership._approvalDate = data.approvalDate;
    membership._approvedBy = data.approvedBy;
    return membership;
  }

  get id(): string {
    return this._id;
  }
  get companyId(): string {
    return this._companyId;
  }
  get type(): CompanyType {
    return this._type;
  }
  get status(): MembershipStatus {
    return this._status;
  }
  get requestDate(): Date {
    return this._requestDate;
  }
  get approvalDate(): Date | undefined {
    return this._approvalDate;
  }
  get approvedBy(): string | undefined {
    return this._approvedBy;
  }

  approve(userId: string): void {
    this.validateUserForApproval(userId);

    if (this._status !== MembershipStatus.PENDING) {
      throw new MembershipCannotBeApprovedError(this._id, this._status);
    }

    this._status = MembershipStatus.ACTIVE;
    this._approvalDate = new Date();
    this._approvedBy = userId;
  }

  reject(): void {
    if (this._status !== MembershipStatus.PENDING) {
      throw new MembershipCannotBeRejectedError(this._id, this._status);
    }

    this._status = MembershipStatus.INACTIVE;
    this._approvalDate = new Date();
  }

  isActive(): boolean {
    return this._status === MembershipStatus.ACTIVE;
  }

  isPending(): boolean {
    return this._status === MembershipStatus.PENDING;
  }

  isInactive(): boolean {
    return this._status === MembershipStatus.INACTIVE;
  }

  isPymeType(): boolean {
    return this._type === CompanyType.PYME;
  }

  isCorporateType(): boolean {
    return this._type === CompanyType.CORPORATE;
  }

  isRecentRequest(days: number = 30): boolean {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this._requestDate.getTime());
    const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return daysDiff <= days;
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new MembershipIdRequiredError();
    }
  }

  private validateCompanyId(companyId: string): void {
    if (!companyId || companyId.trim().length === 0) {
      throw new CompanyIdRequiredError();
    }
  }

  private validateUserForApproval(userId: string): void {
    if (!userId || userId.trim().length === 0) {
      throw new UserIdRequiredForApprovalError();
    }
  }
}
