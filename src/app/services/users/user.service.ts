import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { PageResponse } from '../pagination.model'
import { User } from './user.model'

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
  const response: PageResponse = await axios.get(`${API_BASE_URL}/user`, {
    headers: getAuthHeaders(),
    params: { limit: LIMIT }
  })
  while (response.pageInfo.hasNext) {
    const nextPage: PageResponse = await axios.get(`${API_BASE_URL}/user`, {
      headers: getAuthHeaders(),
      params: { limit: LIMIT, after: response.pageInfo.cursor }
    })
    response.data.push(...nextPage.data)
  }
  return response.data
}
