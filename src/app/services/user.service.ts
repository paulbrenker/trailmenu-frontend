import axios, { AxiosResponse } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { PageResponse } from '../models/pagination.model'
import { User } from '../models/user.model'

const API_BASE_URL = 'https://api.pbrenk.com'
const LIMIT = 10 // default limit for pagination

export function getTokenFromLocalStorage(): string | null {
  return localStorage.getItem('token')
}

export function getAuthHeaders():
  | { Authorization: string }
  | Record<string, never> {
  const token = getTokenFromLocalStorage()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getToken(
  username: string,
  password: string
): Promise<string> {
  const response: { data: { token: string } } = await axios.post(
    `${API_BASE_URL}/user/token`,
    {
      username,
      password
    }
  )
  return response.data.token
}

type DecodedToken = {
  roles?: string[]
  [key: string]: unknown
}

export function isOfRole(role: string): boolean {
  try {
    const token = getTokenFromLocalStorage()
    if (!token) return false

    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.roles?.includes(role) ?? false
  } catch {
    return false
  }
}

export async function getAllUsers(): Promise<User[]> {
  let response: AxiosResponse<PageResponse> = await axios.get(
    `${API_BASE_URL}/user`,
    {
      headers: getAuthHeaders(),
      params: { limit: LIMIT }
    }
  )
  const users: User[] = response.data.data
  console.log(users)
  while (response.data.pageInfo.hasNext) {
    response = await axios.get(`${API_BASE_URL}/user`, {
      headers: getAuthHeaders(),
      params: { limit: LIMIT, after: response.data.pageInfo.cursor }
    })
    users.concat(response.data.data)
  }
  return users
}
