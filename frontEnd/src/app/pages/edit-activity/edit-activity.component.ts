import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Activity } from '../../dto/Activity';
import { Category } from '../../dto/Category';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class EditActivityComponent implements OnInit {
  activityForm: FormGroup;
  categories$: Observable<Category[]> | undefined;

  private apiUrl = 'http://192.168.178.57:8000/api/activities';
  private categoriesUrl = 'http://192.168.178.57:8000/api/categories';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.activityForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      category_id: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.categories$ = this.http.get<Category[]>(this.categoriesUrl);

    this.route.params.pipe(
      switchMap(params => this.http.get<Activity>(`${this.apiUrl}/${params['id']}`))
    ).subscribe(activity => {
      this.activityForm.patchValue(activity);
    });
  }

  updateActivity(): void {
    if (this.activityForm.valid) {
      this.http.put(`${this.apiUrl}/${this.activityForm.value.id}`, this.activityForm.value)
        .subscribe(() => this.router.navigate(['/diary']));
    }
  }
}