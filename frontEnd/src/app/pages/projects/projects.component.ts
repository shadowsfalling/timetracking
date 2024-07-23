import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  newProject: any = { name: '', color: '' };

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

  createProject(): void {
    this.http.post<any>(this.apiUrl, this.newProject).subscribe(project => {
      this.projects.push(project);
      this.newProject = { name: '', color: '' };
    });
  }

  deleteProject(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.projects = this.projects.filter(project => project.id !== id);
    });
  }
}