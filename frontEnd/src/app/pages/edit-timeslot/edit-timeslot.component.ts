import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import moment from 'moment';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-edit-timeslot',
  templateUrl: './edit-timeslot.component.html',
  styleUrls: ['./edit-timeslot.component.scss'],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class EditTimeslotComponent implements OnInit {
  timeslot: any = {};
  projects$: Observable<any[]> | undefined;

  private apiUrl = 'http://192.168.178.57:8000/api/timeslots';
  private projectsUrl = 'http://192.168.178.57:8000/api/projects';

  startDate = new FormControl(new Date());
  startTime = new FormControl('08:00');
  endDate = new FormControl(new Date());
  endTime = new FormControl('16:00');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.projects$ = this.http.get<any[]>(this.projectsUrl);

    this.route.params.pipe(
      switchMap(params => this.http.get<any>(`${this.apiUrl}/${params['id']}`))
    ).subscribe(data => {
      this.timeslot = data;

      this.startDate.setValue(moment(data.start).toDate());
      this.endDate.setValue(data.end ? moment(data.end).toDate() : null);
      this.startTime.setValue(moment(data.start).format('HH:mm'));
      this.endTime.setValue(data.end ? moment(data.end).format('HH:mm') : '');
    });
  }

  updateTimeslot(): void {
    this.timeslot.start = this.formatDateTime(this.startDate.value, this.startTime.value);
    this.timeslot.end = this.formatDateTime(this.endDate.value, this.endTime.value);

    console.log("update timeslot", this.timeslot);

    this.http.put(`${this.apiUrl}/${this.timeslot.id}/full`, this.timeslot)
      .subscribe(() => this.router.navigate(['/timeslots']));
  }

  dateChanged(event: any, type: string): void {
    const date = event.value;
    if (date && type === 'start' && this.startTime.value) {
      this.timeslot.start = this.formatDateTime(date, this.startTime.value);
    } else if (date && type === 'end' && this.endTime.value) {
      this.timeslot.end = this.formatDateTime(date, this.endTime.value);
    }
  }

  timeChanged(event: any, type: string): void {
    const time = event.target.value;
    if (time && type === 'start' && this.startDate.value) {
      this.timeslot.start = this.formatDateTime(this.startDate.value, time);
    } else if (time && type === 'end' && this.endDate.value) {
      this.timeslot.end = this.formatDateTime(this.endDate.value, time);
    }
  }

  formatDateTime(date: Date | null, time: string | null): string | null {
    if (!date || !time) {
      return null;
    }
    const [hours, minutes] = time.split(':').map(Number);
    const formattedDate = moment(date).hours(hours).minutes(minutes).seconds(0).milliseconds(0).format('YYYY-MM-DDTHH:mm');
    return formattedDate;
  }
}