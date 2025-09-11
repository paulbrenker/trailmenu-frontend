import { Component, OnInit, HostListener } from '@angular/core'

import { DatePipe } from '@angular/common'
import { UserPageDisplay } from '../../models/user-page-display.model'
import { PageResponse } from '../../models/page-response.model'
import { User } from '../../models/user.model'
import { UsersService } from '../../services/users.service'
import { Role } from '../../models/role.model'

@Component({
  selector: 'app-users',
  imports: [DatePipe],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: UserPageDisplay[] = []
  currentPage: PageResponse<User> | null = null
  loading = false
  fetching = false
  error = ''
  usersService: UsersService = new UsersService()

  async ngOnInit(): Promise<void> {
    this.loading = true
    try {
      this.currentPage = await this.usersService.getAllUsers()
      this.users = this.currentPage.data.map(user => ({
        username: user.username,
        timestamp: user.addedDate,
        role: user.roles[0].type,
        dropdownOpen: false
      }))
    } catch (err) {
      console.error(err)
      this.error = 'Failed to load users'
    } finally {
      this.loading = false
    }
  }

  async changeRole(username: string, newRole: string): Promise<void> {
    const updatedUser: User = await this.usersService.patchUserRole(username, {
      type: newRole
    } as Role)
    this.users = this.users.map(u =>
      u.username === username
        ? {
            ...u,
            dropdownOpen: !u.dropdownOpen,
            role: updatedUser.roles[0].type
          }
        : { ...u, dropdownOpen: false }
    )
  }

  toggleUserDropdown(user: UserPageDisplay): void {
    this.users = this.users.map(u =>
      u.username === user.username
        ? { ...u, dropdownOpen: !u.dropdownOpen }
        : { ...u, dropdownOpen: false }
    )
  }

  @HostListener('window:scroll', ['$event'])
  async onScroll(): Promise<void> {
    const threshold = 100 // px from bottom to trigger load
    const position = window.scrollY + window.innerHeight
    const height = document.body.scrollHeight

    if (
      !this.fetching &&
      this.currentPage?.pageInfo.hasNext &&
      position > height - threshold
    ) {
      this.fetching = true
      const nextPage: PageResponse<User> | null =
        await this.usersService.getAllUsers(
          undefined,
          undefined,
          this.currentPage.pageInfo.endCursor ?? undefined
        )
      if (nextPage) {
        this.currentPage = nextPage
        this.users = [
          ...this.users,
          ...nextPage.data.map(user => ({
            username: user.username,
            timestamp: user.addedDate,
            role: user.roles[0].type,
            dropdownOpen: false
          }))
        ]
      }
      this.fetching = false
    }
  }
}
