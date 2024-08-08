import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { TimeFormatPipe } from '../time-format.pipe';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TimeFormatPipe]
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() project: any;
  isRunning = false;
  timerType = 'countdown'; // 'countdown' or 'stopwatch'
  remainingTime: number = 0;
  elapsedTime: number = 0;
  startTime: number = 0;
  timerSubscription: Subscription = null!;
  currentTimeslotId: number = 0;

  private apiUrl = 'http://192.168.178.57:8000/api/timeslots';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.resetTimer();
    this.calculateElapsedTime();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  toggleTimer(): void {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  startTimer(): void {
    const timeslot = {
      name: `${this.project.name} Timeslot`,
      project_id: this.project.id
    };

    this.http.post(this.apiUrl, timeslot).subscribe((response: any) => {
      this.currentTimeslotId = response.id;
      this.startTime = Date.now();
      this.startTimerSubscription();
    });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.updateTimeslot();
    this.isRunning = false;
  }

  resetTimer(): void {
    this.remainingTime = this.project.default_duration;
    this.elapsedTime = 0;
  }

  updateTimeslot(): void {
    if (!this.currentTimeslotId) return;

    const timeslot = {
      end: new Date().toISOString()
    };

    this.http.put(`${this.apiUrl}/${this.currentTimeslotId}`, timeslot).subscribe(response => {
      console.log('Timeslot updated:', response);
      this.calculateElapsedTime();
    });

    this.currentTimeslotId = null!;
  }

  switchTimerType(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerType = this.timerType === 'countdown' ? 'stopwatch' : 'countdown';
    this.resetTimer();
    this.calculateElapsedTime();
  }

  updateTimer(): void {
    const now = Date.now();
    const elapsed = Math.floor((now - this.startTime) / 1000);

    if (this.timerType === 'countdown') {
      this.remainingTime = this.project.default_duration - (this.elapsedTime + elapsed);
      if (this.remainingTime <= 0) {
        this.stopTimer();
        this.remainingTime = 0;
        this.updateTimeslot();
      }
    } else {
      this.elapsedTime += elapsed;
      this.startTime = now;
    }
  }

  startTimerSubscription(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateTimer();
    });
  }

  calculateElapsedTime(): void {
    this.http.get<any[]>(`${this.apiUrl}/project/${this.project.id}/today`).subscribe(timeslots => {
      this.elapsedTime = 0;
      let totalElapsedTime = 0;
      const currentTime = Date.now();

      let runningTimeslot = timeslots.find(timeslot => !timeslot.end);
      if (runningTimeslot) {
        this.startTime = new Date(runningTimeslot.start).getTime();
        this.isRunning = true;
        this.currentTimeslotId = runningTimeslot.id;
        this.startTimerSubscription();
      } else {
        this.startTime = currentTime;
      }

      timeslots.forEach(timeslot => {
        const start = new Date(timeslot.start).getTime();
        const end = timeslot.end ? new Date(timeslot.end).getTime() : currentTime;
        totalElapsedTime += (end - start) / 1000;
      });

      this.elapsedTime = totalElapsedTime;

      this.updateTimer();
    });
  }
}