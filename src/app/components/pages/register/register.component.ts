import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmedValidator } from 'src/app/Validators/confirm-password.validator';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  isLoggingIn: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  registerForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password1: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password2: new FormControl('', [Validators.required]),
  }, {
    validator: ConfirmedValidator('password1', 'password2')
  });

  onSubmit() {
    if (!this.registerForm.valid) {
      return;
    }

    this.isLoggingIn = true;

    const email: string = this.registerForm.value.email;
    const password: string = this.registerForm.value.password1;

    this.authenticationService.signUp(email, password).subscribe({
      next: () => {
        this.isLoggingIn = false;
        this.router.navigate(['/notes']);

        this.snackBar.open('Pomyślnie zarejestrowano', 'OK', {
          duration: 3000
        });
      },
      error: errorRes => {
        this.isLoggingIn = false;

        switch(errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            this.snackBar.open('Ten Email jest już zajęty', 'OK', {
              duration: 5000
            });
            break;
          default:
            this.snackBar.open('Nie udało się utworzyć konta', 'OK', {
              duration: 5000
            });
            break;
        }  
      }
    });

    this.registerForm.reset();
  }
}