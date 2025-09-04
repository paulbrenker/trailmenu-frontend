import { Component, OnInit } from '@angular/core'
import { User } from '../../../../models/user.model'
import { getAllUsers } from '../../../../services/user.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = []
  loading = false
  error = ''

  async ngOnInit(): Promise<void> {
    this.loading = true
    try {
      this.users = await getAllUsers()
    } catch (err) {
      console.error(err)
      this.error = 'Failed to load users'
    } finally {
      this.loading = false
    }
  }

  getRoles(user: User): string {
    return user.roles[0].type
  }
}
