import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss'
})
export class DiaryComponent {
  suggestions: string[] = [];
  activities: any[] = []; // Für die heutigen Aktivitäten
  word: string = '';
  showSuggestions: boolean = false;

  private suggestApiUrl = 'http://192.168.178.57:8000/api/categories/suggest'; // Ändere dies zu deiner API-URL
  private createApiUrl = 'http://192.168.178.57:8000/api/activities/create-or-suggest'; // Ändere dies zu deiner API-URL
  private todayActivitiesApiUrl = 'http://192.168.178.57:8000/api/activities/today'; // Ändere dies zu deiner API-URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTodayActivities();
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
      this.activities.push(response.activity); // Neue Aktivität zur Liste hinzufügen
    });
  }

  loadTodayActivities(): void {
    this.http.get<any[]>(this.todayActivitiesApiUrl).subscribe(activities => {
      this.activities = activities;
    });
  }
}