import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { project } from '../../dto/project';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-timeslots',
  templateUrl: './timeslots.component.html',
  styleUrls: ['./timeslots.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class TimeslotsComponent implements OnInit {
  timeslots: any[] = [];
  newTimeslot: any = { name: '', start: '', end: '', project_id: '' };

  projects$: Observable<project[]> | undefined;  

  private apiUrl = 'http://192.168.178.57:8000/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTimeslots();
    this.loadProjects();
  }

  loadProjects() {
    this.projects$ = this.http.get<project[]>(`${this.apiUrl}/projects`);
  }

  loadTimeslots(): void {
    this.http.get<any[]>(`${this.apiUrl}/timeslots`).subscribe(data => {
      this.timeslots = data;
    });
  }

  createTimeslot(): void {
    this.http.post<any>(`${this.apiUrl}/timeslots`, this.newTimeslot).subscribe(timeslot => {
      this.timeslots.push(timeslot);
      this.newTimeslot = { name: '', start: '', end: '' };
    });
  }

  deleteTimeslot(id: number): void {
    this.http.delete(`${this.apiUrl}/timeslots/${id}`).subscribe(() => {
      this.timeslots = this.timeslots.filter(timeslot => timeslot.id !== id);
    });
  }
}