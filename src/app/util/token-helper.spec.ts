import { DecodedToken } from '../models/decoded-token.model'
import { getDecodedToken, jwtIsExpired, userHasRole } from './token.helper'

describe('TokenHelper', () => {
  it('jwtIsExpired should return false if token is still valid', () => {
    const expiration = Math.floor(Date.now() / 1000 + 10) // ten seconds in the future
    const token: DecodedToken = {
      sub: 'test-user',
      roles: ['USER'],
      iat: 123,
      exp: expiration
    }

    const result = jwtIsExpired(token)

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

    const result = jwtIsExpired(token)

    expect(result).toBeTruthy()
  })

  it('userHasRole should return false if user is not Admin', () => {
    const token: DecodedToken = {
      sub: 'test-user',
      roles: ['USER'],
      iat: 123,
      exp: 123
    }

    const result = userHasRole(token, { type: 'ADMIN' })

    expect(result).toBeFalsy()
  })

  it('userHasRole should return true if user is Admin', () => {
    const token: DecodedToken = {
      sub: 'test-user',
      roles: ['ADMIN'],
      iat: 123,
      exp: 123
    }

    const result = userHasRole(token, { type: 'ADMIN' })

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

    const result: DecodedToken = getDecodedToken(testToken)

    expect(result).toEqual(expectedResult)
  })
})
