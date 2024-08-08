import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  newProject: any = { name: '', color: '', default_duration: 0 };

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

    this.newProject.default_duration = this.newProject.default_duration * 60 * 60;

    this.http.post<any>(this.apiUrl, this.newProject).subscribe(project => {
      this.projects.push(project);
      this.newProject = { name: '', color: '' };
    });
  }

  deleteProject(id: number): void {

    // todo: add confirm

    // this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
    //   this.projects = this.projects.filter(project => project.id !== id);
    // });
  }
}
