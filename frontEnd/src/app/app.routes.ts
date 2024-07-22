import { provideRouter, RouterModule, Routes } from '@angular/router';
import { DiaryComponent } from './pages/diary/diary.component';
import { StartComponent } from './pages/start/start.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: StartComponent,  canActivate: [AuthGuard] },
  { path: 'diary', component: DiaryComponent,  canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
];

export const routingProviders = [
  provideRouter(routes)
];