import { Role } from './role.model'

export interface User {
  username: string
  addedDate: string
  roles: Role[]
}

export interface UserPageDisplay {
  username: string
  timestamp: string
  role: string
  dropdownOpen: boolean
}
