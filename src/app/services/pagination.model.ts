import { User } from './users/user.model'

export interface PageInfo {
  pageSize: number
  hasNext: boolean
  cursor: string | null
}

export interface PageResponse {
  pageInfo: PageInfo
  totalCount: number
  data: User[]
}
