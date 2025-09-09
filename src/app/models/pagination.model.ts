export interface PageInfo {
  pageSize: number
  hasNext: boolean
  endCursor: string | null
}

export interface PageResponse<T> {
  pageInfo: PageInfo
  totalCount: number
  data: T[]
}
