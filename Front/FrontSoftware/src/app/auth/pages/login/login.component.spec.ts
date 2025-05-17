import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // ✅ IMPORTANTE

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const navSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        CommonModule,
        HttpClientTestingModule // ✅ NECESARIO PARA QUE HttpClient funcione en pruebas
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: navSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con email y password', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('debería ser inválido si el formulario está vacío', () => {
    component.loginForm.setValue({ email: '', password: '' });
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('debería validar correctamente la contraseña', () => {
    const control = component.loginForm.get('password');
    control?.setValue('weak'); // muy débil
    expect(control?.errors).toBeTruthy();
    expect(control?.errors?.['minLength']).toBeTrue();
    expect(control?.errors?.['uppercase']).toBeTrue();
  });

  it('no debería llamar login si el formulario es inválido', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('debería llamar login y redirigir según el rol', () => {
    component.loginForm.setValue({ email: 'admin@test.com', password: 'Password1!' });

    authServiceSpy.login.and.returnValue(
      of({
        token: 'fake-token',
        role: 'Admin',
        email: 'admin@test.com'
      })
    );

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'admin@test.com',
      password: 'Password1!'
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('debería mostrar mensaje de error si falla el login', () => {
    component.loginForm.setValue({ email: 'wrong@test.com', password: 'Password1!' });
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();

    expect(component.errorMessage).toBe('Credenciales inválidas');
  });


  it('debería fallar si la contraseña tiene menos de 8 caracteres', () => {
    const control = component.loginForm.get('password');
    control?.setValue('Ab1!'); 
    expect(control?.errors?.['minLength']).toBeTrue();
  });

  it('debería fallar si la contraseña no tiene mayúsculas', () => {
    const control = component.loginForm.get('password');
    control?.setValue('password1!');
    expect(control?.errors?.['uppercase']).toBeTrue();
  });

  it('debería fallar si la contraseña no tiene minúsculas', () => {
    const control = component.loginForm.get('password');
    control?.setValue('PASSWORD1!');
    expect(control?.errors?.['lowercase']).toBeTrue();
  });

  it('debería fallar si la contraseña no tiene números', () => {
    const control = component.loginForm.get('password');
    control?.setValue('Password!');
    expect(control?.errors?.['number']).toBeTrue();
  });

  it('debería fallar si la contraseña no tiene caracteres especiales', () => {
    const control = component.loginForm.get('password');
    control?.setValue('Password1');
    expect(control?.errors?.['specialChar']).toBeTrue();
  });

  it('debería pasar si la contraseña cumple todos los criterios', () => {
    const control = component.loginForm.get('password');
    control?.setValue('Password1!');
    expect(control?.errors).toBeNull();
  });
});
