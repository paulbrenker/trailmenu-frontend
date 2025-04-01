import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  static token: string | null = null;

  async onSubmit(): Promise<void> {
    try {
      const response = await axios.post('http://localhost:8080/user/token', {
        username: this.username,
        password: this.password,
      });

      LoginComponent.token = response.data.token;
      console.log('Login successful, token:', LoginComponent.token);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid username or password');
    }
  }
}
