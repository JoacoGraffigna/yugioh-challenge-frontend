import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
 email = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  isRegisterMode = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const action$ = this.isRegisterMode
      ? this.authService.register(this.email, this.password)
      : this.authService.login(this.email, this.password);

    action$.subscribe({
      next: (res) => {
        this.loading = false;

        if (this.isRegisterMode) {
          this.successMessage = 'Usuario registrado correctamente. Ahora podés iniciar sesión.';
          this.isRegisterMode = false;
          this.email = '';
          this.password = '';
        } else {
          this.successMessage = 'Inicio de sesión exitoso.';
          setTimeout(() => this.router.navigate(['/']), 800);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Ocurrió un error. Intentalo nuevamente.';
      },
    });
  }
}
