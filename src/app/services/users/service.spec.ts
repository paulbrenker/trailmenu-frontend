import axios from 'axios'
import { getAllUsers } from './user.service'
import { PageResponse } from '../pagination.model'

jest.mock('axios')

jest.mock('./user.service', () => ({
  ...jest.requireActual('./user.service'),
  getAuthHeaders: jest.fn()
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('getAllUsers', () => {
  beforeAll(() => {
    const localStorageMock = (function () {
      let store: Record<string, string> = {}
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString()
        },
        removeItem: (key: string) => {
          delete store[key]
        },
        clear: () => {
          store = {}
        }
      }
    })()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.localStorage = localStorageMock
  })

  it('fetches users successfully', async () => {
    const mockResponse: PageResponse = {
      pageInfo: {
        pageSize: 1,
        hasNext: false,
        cursor: null
      },
      totalCount: 1,
      data: [
        {
          username: 'paulbrenker',
          roles: [
            {
              type: 'ADMIN'
            }
          ]
        }
      ]
    }

    mockedAxios.get.mockResolvedValue(mockResponse)

    const result = await getAllUsers()

    expect(axios.get.bind(axios)).toHaveBeenCalledTimes(1)
    expect(axios.get.bind(axios)).toHaveBeenCalledWith(
      'https://api.pbrenk.com/user',
      {
        headers: {},
        params: { limit: 10 }
      }
    )
    expect(result).toEqual(mockResponse.data)
  })

  it('propagates errors when the API call fails', async () => {
    const networkError = new Error('Network Error')
    mockedAxios.get.mockRejectedValue(networkError)

    await expect(getAllUsers()).rejects.toThrow('Network Error')

    expect(axios.get.bind(axios)).toHaveBeenCalledWith(
      'https://api.pbrenk.com/user',
      expect.objectContaining({
        headers: {},
        params: { limit: 10 }
      })
    )
  })
})
