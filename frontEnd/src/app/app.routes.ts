import { provideRouter, RouterModule, Routes } from '@angular/router';
import { DiaryComponent } from './pages/diary/diary.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { TrackTimeComponent } from './pages/track-time/track-time.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TimeslotsComponent } from './pages/timeslots/timeslots.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { EditTimeslotComponent } from './pages/edit-timeslot/edit-timeslot.component';
import { EditActivityComponent } from './pages/edit-activity/edit-activity.component';

export const routes: Routes = [
  { path: '', component: TrackTimeComponent,  canActivate: [AuthGuard] },
  { path: 'diary', component: DiaryComponent,  canActivate: [AuthGuard] },
  { path: 'track-time', component: TrackTimeComponent,  canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent,  canActivate: [AuthGuard]  },
  { path: 'timeslots', component: TimeslotsComponent,  canActivate: [AuthGuard]  },
  { path: 'project/:id', component: ProjectDetailComponent },
  { path: 'timeslots/edit/:id', component: EditTimeslotComponent },
  { path: 'activities/edit/:id', component: EditActivityComponent },
];

export const routingProviders = [
  provideRouter(routes)
];