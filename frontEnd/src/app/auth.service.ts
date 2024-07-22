import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api/login'; // Ändere dies zu deiner API-URL

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }) {
    return this.http.post<{ token: string }>(this.apiUrl, credentials)
      .subscribe(response => {
        localStorage.setItem('authToken', response.token);
      });
  }

  logout() {
    localStorage.removeItem('authToken');
  }
}