import { AxiosRequestHeaders, AxiosResponse } from 'axios'
import { UsersService } from './users.service'
import { User } from '../models/user.model'
import { ErrorResponse } from '../models/error-response.model'
import { PageResponse } from '../models/page-response.model'
import { Role } from '../models/role.model'

const axiosClient = {
  post: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn()
}

jest.mock('./api.service', () => {
  return {
    ApiService: class {
      axiosClient = axiosClient
      LIMIT = 20
    }
  }
})

describe('UsersService Test', () => {
  let service: UsersService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new UsersService()
  })

  it('should call POST /user when adding a user', async () => {
    const mockUser: User = {
      username: 'john',
      addedDate: '2025-08-29T14:33:28.273+00:00',
      roles: []
    }
    const mockResponse: AxiosResponse<User> = {
      data: mockUser,
      status: 200,
      statusText: 'Ok',
      headers: {},
      config: { headers: {} as AxiosRequestHeaders }
    }

    axiosClient.post.mockResolvedValue(mockResponse)

    const result = await service.addUser('john', 'secret')

    expect(axiosClient.post).toHaveBeenCalledWith('/user', {
      username: 'john',
      password: 'secret'
    })
    expect(axiosClient.post).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockUser)
  })

  it('should throw ErrorResponse when POST /user fails with 400', async () => {
    const errorResponse: ErrorResponse = {
      status: 400,
      code: '400 BAD REQUEST',
      message: 'User exists already',
      target: '/user'
    }

    axiosClient.post.mockRejectedValue(errorResponse)

    await expect(service.addUser('john', 'secret')).rejects.toEqual(
      errorResponse
    )
    expect(axiosClient.post).toHaveBeenCalledTimes(1)
    expect(axiosClient.post).toHaveBeenCalledWith('/user', {
      username: 'john',
      password: 'secret'
    })
  })

  it('should call GET /user when retrieving a list of users', async () => {
    const mockPage: PageResponse<User> = {
      pageInfo: {
        pageSize: 1,
        hasNext: false,
        endCursor: null
      },
      totalCount: 1,
      data: [
        {
          username: 'paulbrenker',
          addedDate: '2025-08-29T14:33:28.273+00:00',
          roles: [
            {
              type: 'ADMIN'
            }
          ]
        }
      ]
    }

    const mockResponse: AxiosResponse<PageResponse<User>> = {
      data: mockPage,
      status: 200,
      statusText: 'Ok',
      headers: {},
      config: { headers: {} as AxiosRequestHeaders }
    }

    axiosClient.get.mockResolvedValue(mockResponse)

    const result = await service.getAllUsers()

    expect(axiosClient.get).toHaveBeenCalledWith('/user', {
      params: { roleType: undefined, limit: 20, cursor: undefined }
    })
    expect(axiosClient.get).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockPage)
  })

  it('should throw ErrorResponse when GET /user fails with 400', async () => {
    const errorResponse: ErrorResponse = {
      status: 401,
      code: '401 UNAUTHORIZED',
      message: 'Token has expired',
      target: '/user'
    }

    axiosClient.get.mockRejectedValue(errorResponse)

    await expect(service.getAllUsers()).rejects.toEqual(errorResponse)
    expect(axiosClient.get).toHaveBeenCalledTimes(1)
    expect(axiosClient.get).toHaveBeenCalledWith('/user', {
      params: { cursor: undefined, limit: 20, roleType: undefined }
    })
  })

  it('should call PATCH /user/{username}/approval when approving a users role', async () => {
    const mockUser: User = {
      username: 'john',
      addedDate: '2025-08-29T14:33:28.273+00:00',
      roles: [{ type: 'USER' }]
    }

    const mockResponse: AxiosResponse<User> = {
      data: mockUser,
      status: 200,
      statusText: 'Ok',
      headers: {},
      config: { headers: {} as AxiosRequestHeaders }
    }

    axiosClient.patch.mockResolvedValue(mockResponse)

    const result = await service.patchUserRole('john', { type: 'USER' } as Role)

    expect(axiosClient.patch).toHaveBeenCalledWith(
      `/user/${mockUser.username}/approval`,
      {
        roles: [{ type: 'USER' }]
      }
    )
    expect(axiosClient.patch).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mockUser)
  })

  it('should throw ErrorResponse when PATCH /user/{username}/approval fails with 400', async () => {
    const errorResponse: ErrorResponse = {
      status: 400,
      code: '400 BAD REQUEST',
      message: 'Some Error',
      target: '/user'
    }

    axiosClient.patch.mockRejectedValue(errorResponse)

    await expect(
      service.patchUserRole('john', { type: 'USER' })
    ).rejects.toEqual(errorResponse)
    expect(axiosClient.patch).toHaveBeenCalledTimes(1)
    expect(axiosClient.patch).toHaveBeenCalledWith('/user/john/approval', {
      roles: [{ type: 'USER' }]
    })
  })

  it('should call /user/{username} when deleting a user', async () => {
    const testUserName = 'test-user'

    const mockResponse: AxiosResponse<void> = {
      data: undefined,
      status: 204,
      statusText: 'NO_CONTENT',
      headers: {},
      config: { headers: {} as AxiosRequestHeaders }
    }

    axiosClient.delete.mockResolvedValue(mockResponse)

    const response = await service.deleteUser(testUserName)

    expect(axiosClient.delete).toHaveBeenCalledWith(`/user/${testUserName}`)
    expect(axiosClient.delete).toHaveBeenCalledTimes(1)
    expect(response).toBeUndefined()
  })

  it('should return a 404 ErrorResponse when username was not found', async () => {
    const nonExistUserName = 'non-exist'
    const errorResponse: ErrorResponse = {
      status: 404,
      code: '404 NOT_FOUND',
      message: 'User was not found',
      target: '/user'
    }

    axiosClient.delete.mockRejectedValue(errorResponse)

    await expect(service.deleteUser(nonExistUserName)).rejects.toEqual(
      errorResponse
    )
    expect(axiosClient.delete).toHaveBeenCalledTimes(1)
    expect(axiosClient.delete).toHaveBeenCalledWith(`/user/${nonExistUserName}`)
  })
})
