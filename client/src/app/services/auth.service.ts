import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticate_url = 'http://localhost:3000/authenticate';
  constructor(private http: HttpClient) {}
  async valid_user() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user.token) {
      try {
        await this.http.post(this.authenticate_url, { token: user.token });
        return true;
      } catch{
        return false;
      }
    } else {
      return false;
    }
  }
}
