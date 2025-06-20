export class MembershipCannotBeApprovedError extends Error {
  constructor(membershipId: string, currentStatus: string) {
    super(
      `Membership ${membershipId} cannot be approved. Current status: ${currentStatus}`,
    );
    this.name = 'MembershipCannotBeApprovedError';
  }
}

export class MembershipCannotBeRejectedError extends Error {
  constructor(membershipId: string, currentStatus: string) {
    super(
      `Membership ${membershipId} cannot be rejected. Current status: ${currentStatus}`,
    );
    this.name = 'MembershipCannotBeRejectedError';
  }
}

export class MembershipIdRequiredError extends Error {
  constructor() {
    super('Membership ID is required');
    this.name = 'MembershipIdRequiredError';
  }
}

export class CompanyIdRequiredError extends Error {
  constructor() {
    super('Company ID is required');
    this.name = 'CompanyIdRequiredError';
  }
}

export class UserIdRequiredForApprovalError extends Error {
  constructor() {
    super('User ID is required for approval');
    this.name = 'UserIdRequiredForApprovalError';
  }
}

export class InvalidMembershipIdError extends Error {
  constructor(id: string) {
    super(`Invalid membership ID format: "${id}"`);
    this.name = 'InvalidMembershipIdError';
  }
}

export class InvalidUserIdError extends Error {
  constructor(userId: string) {
    super(`Invalid user ID format: "${userId}"`);
    this.name = 'InvalidUserIdError';
  }
}
