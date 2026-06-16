export const ROLES = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  OWNER:       'owner',
  MANAGER:     'manager',
  STAFF:       'staff',
})
export const ROLE_HIERARCHY = Object.freeze({
  [ROLES.SUPER_ADMIN]: 100,
  [ROLES.OWNER]:        80,
  [ROLES.MANAGER]:      50,
  [ROLES.STAFF]:        10,
})
export const ALL_ROLES = Object.values(ROLES)
