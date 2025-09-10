import { AxiosResponse } from 'axios'
import { PageResponse } from '../models/page-response.model'
import { User } from '../models/user.model'
import { ApiService } from './api.service'
import { Role } from '../models/role.model'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class UsersService extends ApiService {
  async addUser(username: string, password: string): Promise<User> {
    const response: AxiosResponse<User> = await this.axiosClient.post('/user', {
      username,
      password
    })
    return response.data
  }

  async getAllUsers(
    roleType: Role[] | undefined = undefined,
    limit: number | undefined = this.LIMIT,
    cursor: string | undefined = undefined
  ): Promise<PageResponse<User>> {
    const response: AxiosResponse<PageResponse<User>> =
      await this.axiosClient.get('/user', {
        params: { roleType, limit, cursor }
      })
    return response.data
  }

  async patchUserRole(username: string, role: Role): Promise<User> {
    const response: AxiosResponse<User> = await this.axiosClient.patch(
      `/user/${username}/approval`,
      { roles: [role] }
    )
    return response.data
  }
}
