import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();

  const allowedRoles = route.data['role'];

  if (!user) {
    console.warn('No hay sesión activa. Redirigiendo a login.');
    router.navigate(['/login']);
    return false;
  }

  const userRole = user.role;
  const hasPermission = Array.isArray(allowedRoles)
    ? allowedRoles.includes(userRole)
    : userRole === allowedRoles;

  if (hasPermission) {
    console.log(`Acceso permitido para rol ${userRole}`);
    return true;
  }

  console.warn(`Acceso denegado para rol ${userRole}. Requiere uno de: ${allowedRoles}`);
  router.navigate(['/access-denied']);
  return false;
};
