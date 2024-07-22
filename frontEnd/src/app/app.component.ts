import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { UserService } from './user.service';
import { AuthInterceptor } from './auth-interceptor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HttpClientModule, RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    UserService
  ]
})
export class AppComponent implements OnInit {
  username: string | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserName().subscribe(
      (data) => {
        this.username = data.username;
      },
      (error) => {
        console.error('Error fetching username:', error);
      }
    );
  }
}