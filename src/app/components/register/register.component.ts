import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import axios from 'axios'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = ''
  password = ''
  errorMessage: string | null = null
  registered = false

  constructor(private router: Router) {}
  ngOnInit(): void {
    document.body.classList.add('login-background')
    document.documentElement.classList.add('login-background')
  }

  ngOnDestroy(): void {
    document.body.classList.remove('login-background')
    document.documentElement.classList.remove('login-background')
  }

  async onSubmit(): Promise<void> {
    try {
      const response = await axios.post('https://api.pbrenk.com/user', {
        username: this.username,
        password: this.password
      })

      console.log('Login successful, token:', response.data.token)
      this.registered = true
    } catch {
      this.errorMessage = 'The user could not be created'
    }
  }
  async goBack(): Promise<void> {
    this.router.navigate(['/login'])
  }
}
