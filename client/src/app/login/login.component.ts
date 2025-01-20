import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  navigateSignUp() {}
  errorMessage = '';
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  private login_url = 'http://localhost:3000/sessions';
  private authenticate_url = 'http://localhost:3000/authenticate';
  constructor(private http: HttpClient, private router: Router) {}

  validForm() {
    return this.email.valid && this.password.valid;
  }
  displayStyles = (input: FormControl) => {
    const styles: object = {
      background: input.valid ? 'green' : 'red',
      color: 'white',
    };
    return styles;
  };

  login() {
    if (!this.validForm()) return;
    const body = {
      username: this.email.value ?? '',
      password: this.password.value ?? '',
    };

    this.http.post(this.login_url, body).subscribe(
      (response) => {
        sessionStorage.setItem('user', JSON.stringify(response));
        this.router.navigate(['/']);
      },
      ({ error }) => {
        this.errorMessage = error;
      }
    );
  }

  async valid_user(): Promise<boolean> {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user.token) {
      try {
        await this.http
          .post(this.authenticate_url, { token: user.token })
          .toPromise();
        return true;
      } catch {
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
