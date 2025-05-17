import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  passwordFieldType: string = 'password';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]]
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        const role = response.role;
        if (role === 'Admin') this.router.navigate(['/admin']);
        else if (role === 'Editor') this.router.navigate(['/editor']);
        else if (role === 'Reader') this.router.navigate(['/reader']);
        else this.router.navigate(['/access-denied']);
      },
      error: () => {
        this.errorMessage = 'Credenciales inválidas';
      }
    });
  }

  // Validador personalizado de contraseña
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const errors: ValidationErrors = {};

    if (value.length < 8) errors['minLength'] = true;
    if (!/[A-Z]/.test(value)) errors['uppercase'] = true;
    if (!/[a-z]/.test(value)) errors['lowercase'] = true;
    if (!/\d/.test(value)) errors['number'] = true;
    if (!/[!@#$%^&*()]/.test(value)) errors['specialChar'] = true;

    return Object.keys(errors).length ? errors : null;
  }
}