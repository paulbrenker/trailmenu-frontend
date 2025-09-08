import { Component, OnInit } from '@angular/core'
import { Role, User, UserPageDisplay } from '../../../../models/user.model'
import { getAllUsers, updateUserRole } from '../../../../services/user.service'
import { PageResponse } from '../../../../models/pagination.model'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-users',
  imports: [DatePipe],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: UserPageDisplay[] = []
  currentPage: PageResponse | null = null
  loading = false
  error = ''

  async ngOnInit(): Promise<void> {
    this.loading = true
    try {
      this.users = (await getAllUsers()).data.map(user => ({
        username: user.username,
        timestamp: user.addedDate,
        role: user.roles[0].type,
        dropdownOpen: false
      }))
      this.currentPage = await getAllUsers()
    } catch (err) {
      console.error(err)
      this.error = 'Failed to load users'
    } finally {
      this.loading = false
    }
  }

  async changeRole(username: string, newRole: string): Promise<void> {
    const updatedUser: User = await updateUserRole(username, {
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

  // TODO implement the user pagination
}
