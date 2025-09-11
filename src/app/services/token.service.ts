import { AxiosResponse } from 'axios'
import { ApiService } from './api.service'
import { TokenResponse } from '../models/token-response.model'

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
}
