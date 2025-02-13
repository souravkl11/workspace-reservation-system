const ROLES = {
  EMPLOYEE: 'employee',
  TEAM_MANAGER: 'team_manager',
  ADMIN: 'admin'
};

const STATUS = {
  PENDING_MANAGER: 'pending_manager',
  REJECTED_BY_MANAGER: 'rejected_by_manager',
  PENDING_ADMIN: 'pending_admin',
  REJECTED_BY_ADMIN: 'rejected_by_admin',
  APPROVED: 'approved'
};

const JWT_SECRET = 'jwtsecret123';

module.exports = { ROLES, STATUS, JWT_SECRET };
