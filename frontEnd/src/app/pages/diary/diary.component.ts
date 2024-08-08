import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import moment from 'moment';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, MatButtonModule],
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnInit {
  suggestions: string[] = [];
  activities: any[] = [];
  word: string = '';
  showSuggestions: boolean = false;
  date: string = '';

  private suggestApiUrl = 'http://192.168.178.57:8000/api/categories/suggest';
  private createApiUrl = 'http://192.168.178.57:8000/api/activities/create-or-suggest';
  private activitiesApiUrl = 'http://192.168.178.57:8000/api/activities';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe(params => {
      this.date = params.get('date') || moment().format('YYYY-MM-DD'); 
      this.loadActivitiesForDate(this.date);
    });
  }

  onInputChange(event: any): void {
    const value = event.target.value;
    if (value) {
      this.getSuggestions(value).subscribe(suggestions => {
        this.suggestions = suggestions;
        this.showSuggestions = true;
      });
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  getSuggestions(query: string): Observable<string[]> {
    return this.http.post<{ suggestions: string[] }>(this.suggestApiUrl, { word: query }).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(response => {
        return of(response.suggestions);
      })
    );
  }

  onSelectSuggestion(suggestion: string): void {
    this.word = suggestion;
    this.showSuggestions = false;
    this.createActivity(this.word);
    this.word = "";
  }

  onEnter(): void {
    if (this.word) {
      this.createActivity(this.word);
      this.showSuggestions = false;
      this.suggestions = [];
      this.word = "";
    }
  }

  createActivity(word: string): void {
    this.http.post<{ message: string, activity: any, category: any }>(this.createApiUrl, { word: word }).subscribe(response => {
      console.log('Activity created:', response.activity);
      this.activities.push(response.activity); 
    });
  }

  loadActivitiesForDate(date: string): void {

    if (date) {

      this.http.get<any[]>(`${this.activitiesApiUrl}?date=${date}`).subscribe(activities => {
        this.activities = activities;
      });
    } else {
      this.http.get<any[]>(`${this.activitiesApiUrl}/today`).subscribe(activities => {
        this.activities = activities;
      });
    }
  }

  dayBefore(): void {
    const previousDay = moment(this.date).subtract(1, 'days').format('YYYY-MM-DD');
    this.router.navigate([], { queryParams: { date: previousDay } });
  }

  today(): void {
    const today = moment().format('YYYY-MM-DD');
    this.router.navigate([], { queryParams: { date: today } });
  }

  dayAfter(): void {
    const nextDay = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
    this.router.navigate([], { queryParams: { date: nextDay } });
  }
}