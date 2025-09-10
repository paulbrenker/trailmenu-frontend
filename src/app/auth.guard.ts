import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { TokenService } from './services/token.service'

export const authGuard: CanActivateFn = () => {
  const router = inject(Router)

  const token = TokenService.getTokenFromLocalStorage()
  if (
    token &&
    !TokenService.jwtIsExpired(TokenService.getDecodedToken(token))
  ) {
    return true
  }

  router.navigate(['/login'])
  return false
}

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router)

  const token = TokenService.getTokenFromLocalStorage()

  if (
    token &&
    TokenService.userHasRole(TokenService.getDecodedToken(token), {
      type: 'ADMIN'
    })
  ) {
    return true
  }

  router.navigate(['/login'])
  return false
}
