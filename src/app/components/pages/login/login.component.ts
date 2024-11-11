import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoggingIn: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  loginForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    this.isLoggingIn = true;

    const email: string = this.loginForm.value.email ?? '';
    const password: string = this.loginForm.value.password ?? '';

    this.authenticationService.signIn(email, password).subscribe({
      next: () => {
        this.isLoggingIn = false;
        this.router.navigate(['/notes']);

        this.snackBar.open('Pomyślnie zalogowano', 'OK', {
          duration: 3000
        });
      },
      error: errorRes => {
        this.isLoggingIn = false;

        if (errorRes.error.error.message === 'EMAIL_NOT_FOUND' || errorRes.error.error.message === 'INVALID_PASSWORD') {
          this.snackBar.open('Email lub hasło jest nieprawidłowe', 'OK', {
            duration: 5000
          });
        } else {
          this.snackBar.open('Nie udało się zalogować', 'OK', {
            duration: 5000
          });
        }
      }
    });
  }
}
