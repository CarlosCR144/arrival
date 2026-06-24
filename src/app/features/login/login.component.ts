import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  mode = signal<'login' | 'register'>('login');
  errorMessage = signal('');
  private returnUrl = '/';

  // Login form fields
  loginEmail = '';
  loginPassword = '';

  // Register form fields
  registerNombre = '';
  registerEmail = '';
  registerPassword = '';
  registerRol: 'arrendatario' | 'arrendador' = 'arrendatario';

  constructor() {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
    // If already logged in, redirect
    if (this.auth.currentUser()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  onLogin(): void {
    this.errorMessage.set('');
    if (!this.loginEmail || !this.loginPassword) {
      this.errorMessage.set('Por favor ingresa tu email y contraseña.');
      return;
    }
    const success = this.auth.login(this.loginEmail, this.loginPassword);
    if (success) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.errorMessage.set('Email o contraseña incorrectos. Verifica tus datos.');
    }
  }

  onRegister(): void {
    this.errorMessage.set('');
    if (!this.registerNombre || !this.registerEmail || !this.registerPassword) {
      this.errorMessage.set('Por favor completa todos los campos.');
      return;
    }
    if (this.registerPassword.length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    const success = this.auth.register({
      nombre: this.registerNombre,
      email: this.registerEmail,
      password: this.registerPassword,
      rol: this.registerRol,
    });
    if (success) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.errorMessage.set('El email ya está registrado. Intenta iniciar sesión.');
    }
  }

  quickLogin(email: string, password: string): void {
    this.loginEmail = email;
    this.loginPassword = password;
    this.onLogin();
  }
}
