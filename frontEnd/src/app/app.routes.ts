import { provideRouter, RouterModule, Routes } from '@angular/router';
import { DiaryComponent } from './pages/diary/diary.component';
import { StartComponent } from './pages/start/start.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { TrackTimeComponent } from './pages/track-time/track-time.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TimeslotsComponent } from './pages/timeslots/timeslots.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';

export const routes: Routes = [
  { path: '', component: StartComponent,  canActivate: [AuthGuard] },
  { path: 'diary', component: DiaryComponent,  canActivate: [AuthGuard] },
  { path: 'track-time', component: TrackTimeComponent,  canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent,  canActivate: [AuthGuard]  },
  { path: 'timeslots', component: TimeslotsComponent,  canActivate: [AuthGuard]  },
  { path: 'project/:id', component: ProjectDetailComponent },
];

export const routingProviders = [
  provideRouter(routes)
];