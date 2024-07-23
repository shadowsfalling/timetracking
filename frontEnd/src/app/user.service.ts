import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://192.168.178.57:8000/api/user'; // Ändere dies zu deiner API-URL

  constructor(private http: HttpClient) { }

  getUserName(): Observable<{ username: string }> {
    return this.http.get<{ username: string }>(this.apiUrl);
  }
}