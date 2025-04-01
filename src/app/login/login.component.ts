import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:8080/user/token', {
        username: this.username,
        password: this.password,
      });

      localStorage.setItem('token', response.data.token);
      console.log('Login successful, token:', response.data.token);
      this.router.navigate(['/']);
    } catch (error) {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
