import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidemenuComponent {
  isOpen = false;

  toggleSidemenu() {
    this.isOpen = !this.isOpen;
  }
}