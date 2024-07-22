import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http:/localhost:8000/api/login'; // Ändere dies zu deiner API-URL

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      map(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          return { success: true };
        } else {
          return { success: false };
        }
      }),
      catchError(error => {
        console.error('Login error', error);
        return of({ success: false });
      })
    );
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  isValidToken(token: string | null): boolean {
    // Überprüfe, ob ein Token vorhanden ist
    return token !== null;
  }
  
}