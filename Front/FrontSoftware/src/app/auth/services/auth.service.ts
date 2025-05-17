import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../pages/Models/LoginResponse';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getCurrentUser(): any {
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }
  

  
  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('https://localhost:7209/api/Auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem('user', JSON.stringify({
          role: response.role,
          email: response.email
        }));
        localStorage.setItem('token', response.token);
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  
  
}
