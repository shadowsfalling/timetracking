import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeFormatPipe } from '../time-format.pipe'; // Importiere die neue Pipe

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TimeFormatPipe] // Füge die Pipe zu den Imports hinzu
})
export class ProjectDetailComponent implements OnInit {
  projectId: number = 0;
  totalTime: number = 0;
  possibleEndTime: string = "";

  private apiUrl = 'http://192.168.178.57:8000/api/timeslots';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      this.getDailySummary();
    });
  }

  getDailySummary(): void {
    this.http.get<any>(`${this.apiUrl}/project/${this.projectId}/summary`).subscribe(response => {
      this.totalTime = response.totalTime;
      this.possibleEndTime = response.possibleEndTime;
    });
  }
}