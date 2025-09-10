import { PageInfo } from './page-info.model'

export interface PageResponse<T> {
  pageInfo: PageInfo
  totalCount: number
  data: T[]
}
