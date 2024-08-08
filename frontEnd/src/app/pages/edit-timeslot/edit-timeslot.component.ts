import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-timeslot',
  templateUrl: './edit-timeslot.component.html',
  styleUrls: ['./edit-timeslot.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditTimeslotComponent implements OnInit {
  timeslot: any = {};
  projects$: Observable<any[]> | undefined;

  private apiUrl = 'http://192.168.178.57:8000/api/timeslots';
  private projectsUrl = 'http://192.168.178.57:8000/api/projects';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.projects$ = this.http.get<any[]>(this.projectsUrl);

    this.route.params.pipe(
      switchMap(params => this.http.get<any>(`${this.apiUrl}/${params['id']}`))
    ).subscribe(data => {
      this.timeslot = data;
    });
  }

  updateTimeslot(): void {
    this.http.put(`${this.apiUrl}/${this.timeslot.id}`, this.timeslot)
      .subscribe(() => this.router.navigate(['/timeslots']));
  }
}