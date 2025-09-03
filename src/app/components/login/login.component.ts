import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { getToken } from '../../services/users/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private router: Router) {}
  ngOnInit(): void {
    document.body.classList.add('login-background');
    document.documentElement.classList.add('login-background');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('login-background');
    document.documentElement.classList.remove('login-background');
  }

  async onSubmit(): Promise<void> {
    try {
      await getToken(this.username, this.password).then((token) => {
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      });
    } catch (error) {
      this.errorMessage = 'Could not log in';
    }
  }

  async goToRegister(): Promise<void> {
    this.router.navigate(['/register']);
  }
}
