import { Component } from '@angular/core'

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  ngOnInit(): void {
    document.body.classList.add('login-background')
    document.documentElement.classList.add('login-background')
  }
}
