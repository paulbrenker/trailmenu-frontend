import { AxiosResponse } from 'axios'
import { ApiService } from './api.service'
import { DecodedToken } from '../models/decoded-token.model'
import { jwtDecode } from 'jwt-decode'
import { Role } from '../models/role.model'
import { Injectable } from '@angular/core'
import { TokenResponse } from '../models/token-response.model'

@Injectable({ providedIn: 'root' })
export class TokenService extends ApiService {
  async getToken(username: string, password: string): Promise<string> {
    const response: AxiosResponse<TokenResponse> = await this.axiosClient.post(
      '/user/token',
      {
        username,
        password
      }
    )
    return response.data.token
  }

  static saveTokenToLocalStorage(token: string): void {
    localStorage.setItem('token', token)
  }

  static getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('token')
  }

  static getDecodedToken(token: string): DecodedToken {
    return jwtDecode<DecodedToken>(token)
  }

  static userHasRole(token: DecodedToken, role: Role): boolean {
    return token.roles?.includes(role.type)
  }

  static jwtIsExpired(token: DecodedToken): boolean {
    const currentTime = Math.floor(Date.now() / 1000)
    return token.exp < currentTime
  }
}
