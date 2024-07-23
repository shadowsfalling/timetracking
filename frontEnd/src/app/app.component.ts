import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { UserService } from './user.service';
import { AuthInterceptor } from './auth-interceptor.service';
import { filter } from 'rxjs';
import { TitleService } from './title.service';
import { SidemenuComponent } from './sidemenu/sidemenu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HttpClientModule, RouterModule, SidemenuComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    UserService
  ]
})
export class AppComponent implements OnInit {
  username: string | undefined;
  title = 'Time tracker';

  constructor(private router: Router, private titleService: TitleService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserName().subscribe(
      (data) => {
        this.username = data.username;
      },
      (error) => {
        console.error('Error fetching username:', error);
      }
    );

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitle(this.router.url);
    });

    this.titleService.currentTitle.subscribe(title => this.title = title);
  }

  private updateTitle(url: string): void {
    // Hier kannst du die Logik implementieren, um die Überschrift basierend auf der URL zu ändern
    if (url.includes('activities')) {
      this.titleService.changeTitle('Activities');
    } else if (url.includes('diary')) {
      this.titleService.changeTitle('Diary');
    } else {
      this.titleService.changeTitle('Time tracker');
    }
  }
}