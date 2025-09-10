import { AxiosRequestHeaders, AxiosResponse } from 'axios'
import { TokenService } from './token.service'
import { DecodedToken } from '../models/decoded-token.model'

const axiosClient = {
  post: jest.fn(),
  get: jest.fn(),
  patch: jest.fn()
}

jest.mock('./api.service', () => {
  return {
    ApiService: class {
      axiosClient = axiosClient
      LIMIT = 20
    }
  }
})

describe('TokenService Test', () => {
  let service: TokenService

  beforeEach(() => {
    jest.clearAllMocks()
    service = new TokenService()
  })

  it('should call POST /user/token when retrieving a JWT Token', async () => {
    const mockResponse: AxiosResponse<string> = {
      data: 'some-token',
      status: 200,
      statusText: 'Ok',
      headers: {},
      config: { headers: {} as AxiosRequestHeaders }
    }

    axiosClient.post.mockResolvedValue(mockResponse)

    const result = await service.getToken('john', 'password123')

    expect(axiosClient.post).toHaveBeenCalledWith('/user/token', {
      username: 'john',
      password: 'password123'
    })
    expect(axiosClient.post).toHaveBeenCalledTimes(1)
    expect(result).toEqual('some-token')
  })

  it('jwtIsExpired should return false if token is still valid', () => {
    const expiration = Math.floor(Date.now() / 1000 + 10) // ten seconds in the future
    const token: DecodedToken = {
      sub: 'test-user',
      roles: ['USER'],
      iat: 123,
      exp: expiration
    }

    const result = TokenService.jwtIsExpired(token)

    expect(result).toBeFalsy()
  })

  it('jwtIsExpired should return true if token is expired', () => {
    const expiration = Math.floor(Date.now() / 1000 - 10) // ten seconds in the past
    const token: DecodedToken = {
      sub: 'test-user',
      roles: ['USER'],
      iat: 123,
      exp: expiration
    }

    const result = TokenService.jwtIsExpired(token)

    expect(result).toBeTruthy()
  })

  it('userHasRole should return false if user is not Admin', () => {
    const token: DecodedToken = {
      sub: 'test-user',
      roles: ['USER'],
      iat: 123,
      exp: 123
    }

    const result = TokenService.userHasRole(token, { type: 'ADMIN' })

    expect(result).toBeFalsy()
  })

  it('userHasRole should return true if user is Admin', () => {
    const token: DecodedToken = {
      sub: 'test-user',
      roles: ['ADMIN'],
      iat: 123,
      exp: 123
    }

    const result = TokenService.userHasRole(token, { type: 'ADMIN' })

    expect(result).toBeTruthy()
  })

  it('getDecodedToken returns a well mapped token', () => {
    const testToken =
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwYXVsYnJlbmtlciIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTc1NzM0NTk3NCwiZXhwIjoxNzU3MzQ5NTc0fQ.jpPElPKHLlqrS17VhgOGASiV-wcKJ98obvr_U9V-LfU'

    const expectedResult: DecodedToken = {
      sub: 'paulbrenker',
      roles: ['ADMIN'],
      iat: 1757345974,
      exp: 1757349574
    }

    const result: DecodedToken = TokenService.getDecodedToken(testToken)

    expect(result).toEqual(expectedResult)
  })
})
