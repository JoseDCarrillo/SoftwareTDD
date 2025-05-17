import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./app/admin/admin.module').then(m => m.AdminModule),
    data: { role: ['Admin'] } // Solo Admin
  },
  {
    path: 'editor',
    canActivate: [authGuard],
    loadChildren: () => import('./app/editor/editor.module').then(m => m.EditorModule),
    data: { role: ['Editor', 'Admin'] } // Admin y Editor
  },
  {
    path: 'reader',
    canActivate: [authGuard],
    loadChildren: () => import('./app/reader/reader.module').then(m => m.ReaderModule),
    data: { role: ['Reader', 'Editor', 'Admin'] } // Todos los roles pueden leer
  },
  {
    path: 'access-denied',
    loadComponent: () => import('./shared/pages/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
  },

  { path: '**', redirectTo: 'login' }
];
  
