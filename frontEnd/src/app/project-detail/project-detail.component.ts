import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeFormatPipe } from '../time-format.pipe';
import moment from 'moment';
import { Observable } from 'rxjs/internal/Observable';
import Chart from 'chart.js/auto';
import { MatButtonModule } from '@angular/material/button';
import { MonthTime } from '../dto/monthTime';
import { Timeslot } from '../dto/timeslot';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TimeFormatPipe, MatButtonModule]
})
export class ProjectDetailComponent implements OnInit {
  projectId: number = 0;
  totalTime: number = 0;
  possibleEndTime: string = "";

  monthSummary$: Observable<MonthTime> | undefined;
  dayTimeSlots$: Observable<Timeslot[]> | undefined;

  progress: number = 0;
  max: number = 100;

  chart: any = null!;

  private apiUrl = 'http://192.168.178.57:8000/api/timeslots';

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      this.getDailySummary();
    });
  }

  getDailySummary(): void {
    const date = moment().format('YYYY-MM-DD');

    this.http.get<any>(`${this.apiUrl}/project/${this.projectId}/summary/today`).subscribe(response => {
      this.totalTime = response.totalTime;
      this.possibleEndTime = response.possibleEndTime;
    });

    this.dayTimeSlots$ = this.http.get<Timeslot[]>(`${this.apiUrl}/project/${this.projectId}/today`);

    this.monthSummary$ = this.http.get<MonthTime>(`${this.apiUrl}/project/${this.projectId}/summary/month`, { params: { 'date': date } });
    this.monthSummary$.subscribe((summary: MonthTime) => {
      this.progress = (summary.totalTime / summary.monthlyDefaultDuration) * 100;

      // Labels für jeden Tag des Monats
      const startOfMonth = moment(date).startOf('month');
      const endOfMonth = moment(date).endOf('month');
      const labels = [];
      const dailyData = [];
      const averageData = [];
      // const averageTime = summary.monthlyDefaultDuration / moment(date).daysInMonth();

      const filteredEntries = Object.entries(summary.dailySummaries).filter(([key, value]) => value > 0);


      const averageTime = summary.totalTime / 3600 / filteredEntries.length;
      console.log(averageTime, summary.totalTime / filteredEntries.length, summary.totalTime, filteredEntries.length)

      for (let day = startOfMonth; day.isSameOrBefore(endOfMonth); day.add(1, 'days')) {
        const formattedDay = day.format('YYYY-MM-DD');
        labels.push(formattedDay);
        dailyData.push((summary.dailySummaries[formattedDay] || 0) / 3600); // Umrechnung in Stunden
        averageData.push(averageTime); // Umrechnung in Stunden
      }

      this.updateChart(labels, dailyData, averageData);
    });
  }

  updateChart(labels: string[], dailyData: number[], averageData: number[]): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Trackierte Zeit (Stunden)',
            data: dailyData,
            backgroundColor: '#45ccce',
            borderWidth: 1,
          },
          {
            label: 'Durchschnittliche Zeit (Stunden)',
            data: averageData,
            type: 'line',
            fill: false,
            borderColor: '#ff6384',
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  get circumference(): number {
    return 2 * Math.PI * 45; // Radius des Kreises (45 ist ein Beispielwert)
  }

  get strokeDashoffset(): number {
    return this.circumference - (this.progress / 100) * this.circumference;
  }

  getTimeSpan(timeslot: Timeslot) {

    let end = moment(timeslot.end);
    const start = moment(timeslot.start);

    var duration = moment.duration(end.diff(start));
    return duration.asSeconds();

  }
}