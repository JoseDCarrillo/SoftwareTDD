import { Component } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  user: any;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getCurrentUser();
    console.log('SidebarComponent: Usuario cargado =>', this.user);
  }

  navigateTo(path: string): void {
    console.log(`Intentando navegar a: ${path}`);
    this.router.navigate([path]).then(success => {
      console.log(`Resultado de navegación a "${path}":`, success);
    }).catch(error => {
      console.error(`Error al navegar a "${path}":`, error);
    });
  }

  logout(): void {
    console.log('Cerrando sesión del usuario:', this.user);
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      console.log('Redirigido al login después del logout');
    });
  }
}
