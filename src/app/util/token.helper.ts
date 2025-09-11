import { DecodedToken } from '../models/decoded-token.model'
import { jwtDecode } from 'jwt-decode'
import { Role } from '../models/role.model'

export function saveTokenToLocalStorage(token: string): void {
  localStorage.setItem('token', token)
}

export function getTokenFromLocalStorage(): string | null {
  const token = localStorage.getItem('token')
  return token
}

export function getDecodedToken(token: string): DecodedToken {
  return jwtDecode<DecodedToken>(token)
}

export function userHasRole(token: DecodedToken, role: Role): boolean {
  return token.roles?.includes(role.type)
}

export function jwtIsExpired(token: DecodedToken): boolean {
  const currentTime = Math.floor(Date.now() / 1000)
  return token.exp < currentTime
}
