import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TimerComponent } from '../../timer/timer.component';

@Component({
  selector: 'app-track-time',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TimerComponent],
  templateUrl: './track-time.component.html',
  styleUrl: './track-time.component.scss'
})
export class TrackTimeComponent {
  projects: any[] = [];
  selectedProject: any = null;

  private apiUrl = 'http://192.168.178.57:8000/api/projects';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.projects = data;
    });
  }

  addTimerForProject(project: any): void {
    this.selectedProject = project;
  }
}
