import { Routes } from '@angular/router'
import { LoginComponent } from './shared/login/login.component'
import { authGuard } from './util/auth.guard'
import { DashboardComponent } from './components/dashboard/dashboard.component'
import { RegisterComponent } from './shared/register/register.component'
import { adminGuard } from './util/admin.guard'
import { UsersComponent } from './components/users/users.component'
import { NotFoundComponent } from './shared/not-found/not-found.component'

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'users', component: UsersComponent, canActivate: [adminGuard] }
    ]
  },
  { path: '**', component: NotFoundComponent }
]
