import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { Router } from '@angular/router'
import { TokenService } from '../../services/token.service'
import { saveTokenToLocalStorage } from '../../util/token.helper'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = ''
  password = ''
  errorMessage: string | null = null
  tokenService = new TokenService()

  constructor(
    private router: Router
    //private tokenService: TokenService
  ) {}

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
      const token = await this.tokenService.getToken(
        this.username,
        this.password
      )

      saveTokenToLocalStorage(token)
      this.router.navigate(['/'])
    } catch (error) {
      console.log(error)
      this.errorMessage = 'Could not log in'
    }
  }

  async goToRegister(): Promise<void> {
    this.router.navigate(['/register'])
  }
}
