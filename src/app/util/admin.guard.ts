import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import {
  getDecodedToken,
  getTokenFromLocalStorage,
  userHasRole
} from './token.helper'

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
