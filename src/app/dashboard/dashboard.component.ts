import { Component } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ContentComponent } from './content/content.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, ContentComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
