import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectorRef } from '@angular/core';

import {
  FormControl,
  Validators,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  FormGroup,
} from '@angular/forms';

export interface HighScore {
  username: string;
  score: number;
}

export interface User {
  token: string;
  username: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    MatSortModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private authenticate_url = 'http://localhost:3000/authenticate';
  private highscore_url = 'http://localhost:3000/highscore';
  private signout_url = 'http://localhost:3000/sessions';
  errorHighScoreMessage = '';
  highscores: HighScore[] = [];
  sortedData: HighScore[] | undefined;
  user: User;
  highscore: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.user = userData;
    this.highscore = this.formBuilder.group({
      score: ['', [Validators.required]],
      username: userData.username || '',
    });
  }

  async getHighScores() {
    try {
      const response = await this.http.get(this.highscore_url).toPromise();
      if (response) {
        this.highscores = <HighScore[]>response;
        this.cdr.detectChanges();
      }
    } catch (error) {}
  }

  async logout() {
    try {
      const url = `${this.signout_url}/${this.user.token}`;
      await this.http.delete(url);
      sessionStorage.removeItem('user');
      this.router.navigate(['/login']);
    } catch (error) {}
  }

  async addHighscore() {
    if (!this.highscore.valid) return;
    const body = {
      username: this.highscore.get('username')?.value ?? '',
      score: this.highscore.get('score')?.value ?? '',
    };
    try {
      await this.http.post(this.highscore_url, body).toPromise();
    } catch (error) {}
  }

  async valid_user(): Promise<boolean> {
    let user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user.token) {
      try {
        await this.http
          .post(this.authenticate_url, { token: user.token })
          .toPromise();
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return false;
    }
  }

  async ngOnInit() {
    try {
      const valid = await this.valid_user();
      if (!valid) {
        this.router.navigate(['/login']);
        return;
      }
      await this.getHighScores();
      this.sortedData = this.highscores.slice();
    } catch (error) {}
  }

  sortData(sort: Sort) {
    const data = this.highscores.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'score':
          return compare(a.score, b.score, isAsc);
        case 'username':
          return compare(a.username, b.username, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
