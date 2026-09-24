export const ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  USERS_READ: "users.read",
  USERS_WRITE: "users.write",
  COURSES_READ: "courses.read",
  COURSES_MODERATE: "courses.moderate",
  PAYMENTS_READ: "payments.read",
  REFUNDS_MANAGE: "refunds.manage",
  PAYOUTS_MANAGE: "payouts.manage",
  ADMINS_CREATE: "admins.create",
  ADMINS_MANAGE: "admins.manage",
  SETTINGS_MANAGE: "settings.manage",
  AUDIT_READ: "audit.read",
  CATEGORIES_MANAGE: "categories.manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Default permissions per role — superadmin has all
export const ROLE_DEFAULT_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.STUDENT]: [],
  [ROLES.INSTRUCTOR]: [PERMISSIONS.COURSES_READ],
  [ROLES.ADMIN]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.COURSES_READ,
    PERMISSIONS.COURSES_MODERATE,
    PERMISSIONS.PAYMENTS_READ,
    PERMISSIONS.AUDIT_READ,
  ],
  [ROLES.SUPERADMIN]: Object.values(PERMISSIONS),
};
