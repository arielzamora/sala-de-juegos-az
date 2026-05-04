import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  authService = inject(AuthService);
  router = inject(Router);

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (err) {
      console.error(err);
    }
  }
}
