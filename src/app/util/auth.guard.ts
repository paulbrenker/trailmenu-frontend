import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import {
  getDecodedToken,
  getTokenFromLocalStorage,
  jwtIsExpired
} from './token.helper'

export const authGuard: CanActivateFn = () => {
  const router = inject(Router)
  const token = getTokenFromLocalStorage()
  if (token && !jwtIsExpired(getDecodedToken(token))) {
    return true
  }

  router.navigate(['/login'])
  return false
}
