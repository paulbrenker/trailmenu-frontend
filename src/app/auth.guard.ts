import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import {
  getDecodedTokenFromLocalStorage,
  isJwtExpired,
  isOfRole
} from './services/user.service'

export const authGuard: CanActivateFn = () => {
  const token = getDecodedTokenFromLocalStorage()
  const router = inject(Router)

  if (token && !isJwtExpired(token)) {
    return true
  } else {
    router.navigate(['/login'])
    return false
  }
}

export const adminGuard: CanActivateFn = () => {
  const isAdmin = isOfRole('ADMIN')
  const router = inject(Router)

  if (isAdmin) {
    return true
  } else {
    router.navigate(['/'])
    return false
  }
}
