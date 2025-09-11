import { AxiosRequestHeaders, AxiosResponse } from 'axios'
import { TokenService } from './token.service'
import { TokenResponse } from '../models/token-response.model'

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
    const mockResponse: AxiosResponse<TokenResponse> = {
      data: { token: 'some-token' },
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
})
