import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Validators,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  errorMessage = '';
  hidePassword = true;
  hideConfirmPassword = true;
  user = this.formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    },
    {
      validators: this.matchValidator('password', 'confirmPassword'),
    }
  );
  name = this.formBuilder.group({
    company: ['FH Technikum Wien'],
  });

  address = this.formBuilder.group({
    street: [''],
    city: [''],
    postcode: [''],
  });
  private signup_url = 'http://localhost:3000/users';
  private authenticate_url = 'http://localhost:3000/authenticate';

  isSignUpValid(): boolean {
    return this.user.valid;
  }

  signUp() {
    if (!this.isSignUpValid()) return;

    const body = {
      username: this.user.get('email')?.value ?? '',
      password: this.user.get('password')?.value ?? '',
      companyName: this.name.get('company')?.value ?? '',
      address: {
        street: this.address.get('street')?.value ?? '',
        city: this.address.get('city')?.value ?? '',
        postcode: this.address.get('postcode')?.value ?? '',
      },
    };

    this.http.post(this.signup_url, body).subscribe(
      (response) => {
        sessionStorage.setItem('user', JSON.stringify(response));
        this.router.navigate(['/']);
      },
      ({ error }) => {
        this.errorMessage = error;
      }
    );
  }

  matchValidator(password: string, confirmPassword: string): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const passwordInput = abstractControl.get(password);
      const confirmPasswordInput = abstractControl.get(confirmPassword);
      if (
        passwordInput!.errors &&
        !confirmPasswordInput!.errors?.['confirmedValidator']
      ) {
        return null;
      }
      if (passwordInput!.value !== confirmPasswordInput!.value) {
        const error = { confirmedValidator: 'Passwords do not match.' };
        confirmPasswordInput!.setErrors(error);
        return error;
      } else {
        confirmPasswordInput!.setErrors(null);
        return null;
      }
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  async valid_user(): Promise<boolean> {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user.token) {
      try {
        await this.http
          .post(this.authenticate_url, { token: user.token })
          .toPromise();
        return true;
      } catch{
        return false;
      }
    } else {
      return false;
    }
  }

  async ngOnInit() {
    const valid = await this.valid_user();
    if (valid) {
      this.router.navigate(['/']);
      return;
    }
  }
}
