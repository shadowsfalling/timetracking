import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidemenuComponent {
  isOpen = false;

  constructor(private authService: AuthService) {

  }

  toggleSidemenu() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}