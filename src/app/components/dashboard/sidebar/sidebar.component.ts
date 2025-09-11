import { Component } from '@angular/core'
import { Router } from '@angular/router'
import {
  getDecodedToken,
  getTokenFromLocalStorage,
  userHasRole
} from '../../../util/token.helper'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true
})
export class SidebarComponent {
  collapsed = false

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.collapsed = !this.collapsed
  }
  navigateTo(route: string): void {
    this.router.navigate([route])
  }

  userIsAdmin(): boolean {
    const token = getTokenFromLocalStorage()
    if (
      token &&
      userHasRole(getDecodedToken(token), {
        type: 'ADMIN'
      })
    ) {
      return true
    }
    return false
  }

  onLogout(): void {
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }
}
