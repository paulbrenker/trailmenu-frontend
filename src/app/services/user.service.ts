import axios, { AxiosResponse } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { PageResponse } from '../models/pagination.model'
import { Role, User } from '../models/user.model'

const API_BASE_URL = 'https://api.pbrenk.com'
const LIMIT = 20 // default limit for pagination

export function getDecodedTokenFromLocalStorage(): DecodedToken | null {
  const token: string | null = getTokenFromLocalStorage()
  if (!token) return null
  try {
    return jwtDecode<DecodedToken>(token)
  } catch {
    return null
  }
}

export function getTokenFromLocalStorage(): string | null {
  return localStorage.getItem('token')
}

export function getAuthHeaders():
  | { Authorization: string }
  | Record<string, never> {
  const token: string | null = getTokenFromLocalStorage()
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
  sub: string
  roles: string[]
  iat: number
  exp: number
}

export function isOfRole(role: string): boolean {
  try {
    const token = getDecodedTokenFromLocalStorage()
    if (!token) return false
    return token.roles?.includes(role) ?? false
  } catch {
    return false
  }
}

export function isJwtExpired(token: DecodedToken): boolean {
  const currentTime = Math.floor(Date.now() / 1000)
  return token.exp < currentTime
}

export async function getAllUsers(
  limit: number | undefined = LIMIT,
  cursor: string | undefined = undefined
): Promise<PageResponse> {
  const response: AxiosResponse<PageResponse> = await axios.get(
    `${API_BASE_URL}/user`,
    {
      headers: getAuthHeaders(),
      params: { limit, cursor }
    }
  )
  return response.data
}

export async function updateUserRole(
  username: string,
  role: Role
): Promise<User> {
  const response: AxiosResponse<User> = await axios.patch(
    `${API_BASE_URL}/user/${username}/approval`,
    { roles: [role] },
    { headers: getAuthHeaders() }
  )
  return response.data
}
