import { AxiosResponse } from 'axios'
import { ApiService } from './api.service'
import { DecodedToken } from '../models/decoded-token.model'
import { jwtDecode } from 'jwt-decode'
import { Role } from '../models/role.model'

export class TokenService extends ApiService {
  async getToken(username: string, password: string): Promise<string> {
    const response: AxiosResponse<string> = await this.axiosClient.post(
      '/user/token',
      {
        username,
        password
      }
    )
    return response.data
  }

  saveTokenToLocalStorage(token: string): void {
    localStorage.setItem('token', token)
  }

  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('token')
  }

  getDecodedToken(token: string): DecodedToken {
    return jwtDecode<DecodedToken>(token)
  }

  userHasRole(token: DecodedToken, role: Role): boolean {
    return token.roles?.includes(role.type)
  }

  jwtIsExpired(token: DecodedToken): boolean {
    const currentTime = Math.floor(Date.now() / 1000)
    return token.exp < currentTime
  }
}
