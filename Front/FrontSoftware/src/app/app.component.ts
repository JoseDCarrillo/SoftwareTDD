import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FrontSoftware';
  showSidebar = true;
  currentUrl: string = '';
  
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
      console.log('Ruta actual:', this.currentUrl); // ✅ Log para validar
    });
  }

  isLoggedIn(): boolean {
    // Revisa si hay un token o usuario guardado
    return !!localStorage.getItem('token');
  }

  shouldShowSidebar(): boolean {
    // Oculta el sidebar si estás en login o access-denied
    return !['/login', '/access-denied'].includes(this.router.url);
  }
}