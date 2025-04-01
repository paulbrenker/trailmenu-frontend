import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: '**', redirectTo: '', canActivate: [authGuard] }, only when there is a dash
  { path: '**', redirectTo: 'login' }, // then redirect to main
];
