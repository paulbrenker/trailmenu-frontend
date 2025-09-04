import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { getTokenFromLocalStorage, isOfRole } from './services/user.service'

export const authGuard: CanActivateFn = () => {
  const token = getTokenFromLocalStorage()
  const router = inject(Router)

  if (token) {
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
