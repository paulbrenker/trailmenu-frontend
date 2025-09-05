import { Component, OnInit } from '@angular/core'
import { UserPageDisplay } from '../../../../models/user.model'
import { getAllUsers } from '../../../../services/user.service'
import { PageResponse } from '../../../../models/pagination.model'

@Component({
  selector: 'app-users',
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
    // TODO implement API call
    this.users = this.users.map(u =>
      u.username === username
        ? { ...u, dropdownOpen: !u.dropdownOpen, role: newRole }
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
