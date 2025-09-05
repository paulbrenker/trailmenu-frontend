export interface User {
  username: string
  roles: Role[]
}

export interface Role {
  type: 'ADMIN' | 'USER' | 'GUEST' // Add other role types as needed
}

export interface UserPageDisplay {
  username: string
  role: string
  dropdownOpen: boolean
}
