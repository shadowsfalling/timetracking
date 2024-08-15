import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
import { MatButtonModule } from '@angular/material/button';
import { Project } from '../../dto/project';

@Component({
  selector: 'app-timeslots',
  templateUrl: './timeslots.component.html',
  styleUrls: ['./timeslots.component.scss'],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule]
})
export class TimeslotsComponent implements OnInit {
  timeslots: any[] = [];
  newTimeslot: any = { name: '', start: '', end: '', project_id: '' };

  projects$: Observable<Project[]> | undefined;

  private apiUrl = 'http://192.168.178.57:8000/api';


  startDate = new FormControl(new Date());
  startTime = new FormControl('08:00');
  endDate = new FormControl(new Date());
  endTime = new FormControl('16:00');

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.loadTimeslots();
    this.loadProjects();

    this.dateChanged(this.startDate, 'start');
    this.dateChanged(this.endDate, 'end');
  }

  loadProjects() {
    this.projects$ = this.http.get<Project[]>(`${this.apiUrl}/projects`);
  }

  loadTimeslots(): void {
    this.http.get<any[]>(`${this.apiUrl}/timeslots`).subscribe(data => {
      this.timeslots = data;
    });
  }
  createTimeslot(): void {
    if (this.startDate.value && this.startTime.value) {
      this.newTimeslot.start = this.formatDateTime(this.startDate.value, this.startTime.value);
    }
    if (this.endDate.value && this.endTime.value) {
      this.newTimeslot.end = this.formatDateTime(this.endDate.value, this.endTime.value);
    }

    if (this.newTimeslot.project_id && this.newTimeslot.name && this.newTimeslot.start) {
      this.http.post<any>(`${this.apiUrl}/timeslots/full`, this.newTimeslot).subscribe(
        () => {
          this.router.navigate(['/timeslots']);
        },
        (error) => {
          console.error('Error creating timeslot:', error);
        }
      );
    } else {
      console.error('Timeslot data is incomplete:', this.newTimeslot);
    }
  }

  deleteTimeslot(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.timeslots = this.timeslots.filter(t => t.id !== id);
    });
  }

  dateChanged(event: any, type: string): void {
    const date = event.value;
    if (date && type === 'start' && this.startTime.value) {
      this.newTimeslot.start = this.formatDateTime(date, this.startTime.value);
    } else if (date && type === 'end' && this.endTime.value) {
      this.newTimeslot.end = this.formatDateTime(date, this.endTime.value);
    }
  }

  timeChanged(event: any, type: string): void {
    const time = event.target.value;
    if (time && type === 'start' && this.startDate.value) {
      this.newTimeslot.start = this.formatDateTime(this.startDate.value, time);
    } else if (time && type === 'end' && this.endDate.value) {
      this.newTimeslot.end = this.formatDateTime(this.endDate.value, time);
    }
  }

  formatDateTime(date: Date, time: string): string {
    if (!date || !time) {
      return '';
    }
    const [hours, minutes] = time.split(':').map(Number);
    const formattedDate = moment(date).hours(hours).minutes(minutes).seconds(0).milliseconds(0).format('YYYY-MM-DDTHH:mm');
    return formattedDate;
  }

  getDateTime(date: string, time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const combined = moment(date).hours(hours).minutes(minutes);
    return combined.toISOString();
  }
}