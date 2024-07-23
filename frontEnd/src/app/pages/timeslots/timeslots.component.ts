import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-timeslots',
  templateUrl: './timeslots.component.html',
  styleUrls: ['./timeslots.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class TimeslotsComponent implements OnInit {
  timeslots: any[] = [];
  newTimeslot: any = { name: '', start: '', end: '' };

  private apiUrl = 'http://192.168.178.57:8000/api/timeslots';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTimeslots();
  }

  loadTimeslots(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.timeslots = data;
    });
  }

  createTimeslot(): void {
    this.http.post<any>(this.apiUrl, this.newTimeslot).subscribe(timeslot => {
      this.timeslots.push(timeslot);
      this.newTimeslot = { name: '', start: '', end: '' };
    });
  }

  deleteTimeslot(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.timeslots = this.timeslots.filter(timeslot => timeslot.id !== id);
    });
  }
}