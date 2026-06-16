import { ROLES, ROLE_HIERARCHY } from '../../../shared/constants/roles.js'
export function hasMinimumRole(userRole, requiredRole) {
  return (ROLE_HIERARCHY[userRole] ?? -1) >= (ROLE_HIERARCHY[requiredRole] ?? 0)
}
export function isRoleAllowed(userRole, allowedRoles) { return allowedRoles.includes(userRole) }
export function getRoleLabel(role) {
  return { [ROLES.SUPER_ADMIN]:'Super Admin', [ROLES.OWNER]:'Owner', [ROLES.MANAGER]:'Manager', [ROLES.STAFF]:'Staff' }[role] ?? role
}
export function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) }
