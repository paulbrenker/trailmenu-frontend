export interface User {
  username: string
  roles: Role[]
}

export interface Role {
  type: 'ADMIN' | 'USER' | 'GUEST' // Add other role types as needed
}
