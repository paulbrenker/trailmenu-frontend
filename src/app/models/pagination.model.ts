import { User } from '../models/user.model'

export interface PageInfo {
  pageSize: number
  hasNext: boolean
  endCursor: string | null
}

export interface PageResponse {
  pageInfo: PageInfo
  totalCount: number
  data: User[]
}
