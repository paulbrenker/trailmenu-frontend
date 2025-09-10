import { Role } from './role.model'

export interface User {
  username: string
  addedDate: string
  roles: Role[]
}
