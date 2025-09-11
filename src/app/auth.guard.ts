import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import {
  getDecodedToken,
  getTokenFromLocalStorage,
  jwtIsExpired,
  userHasRole
} from './util/token.helper'

export const authGuard: CanActivateFn = () => {
  const router = inject(Router)
  const token = getTokenFromLocalStorage()
  if (token && !jwtIsExpired(getDecodedToken(token))) {
    return true
  }

  router.navigate(['/login'])
  return false
}

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router)

  const token = getTokenFromLocalStorage()

  if (
    token &&
    userHasRole(getDecodedToken(token), {
      type: 'ADMIN'
    })
  ) {
    return true
  }

  router.navigate(['/login'])
  return false
}
