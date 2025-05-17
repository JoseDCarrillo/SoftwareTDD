import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginResponse } from '../pages/Models/LoginResponse';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const dummyResponse: LoginResponse = {
    token: 'fake-token',
    email: 'admin@test.com',
    role: 'Admin'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user from localStorage', () => {
    const mockUser = { role: 'Admin', email: 'admin@test.com' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    const result = service.getCurrentUser();
    expect(result).toEqual(mockUser);
  });

  it('should return null if no user is in localStorage', () => {
    localStorage.removeItem('user');
    const result = service.getCurrentUser();
    expect(result).toBeNull();
  });

  it('should store token and user in localStorage on login', () => {
    const credentials = { email: 'admin@test.com', password: 'Password1!' };

    service.login(credentials).subscribe((res) => {
      expect(res).toEqual(dummyResponse);

      const storedUser = JSON.parse(localStorage.getItem('user')!);
      const storedToken = localStorage.getItem('token');

      expect(storedUser).toEqual({ role: dummyResponse.role, email: dummyResponse.email });
      expect(storedToken).toEqual(dummyResponse.token);
    });

    const req = httpMock.expectOne('https://localhost:7209/api/Auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(dummyResponse);
  });

  it('should clear localStorage on logout', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'x', role: 'x' }));
    localStorage.setItem('token', '123456');

    service.logout();

    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
