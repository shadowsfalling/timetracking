import { provideRouter, RouterModule, Routes } from '@angular/router';
import { DiaryComponent } from './pages/diary/diary.component';
import { StartComponent } from './pages/start/start.component';

export const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'diary', component: DiaryComponent }
];

export const routingProviders = [
  provideRouter(routes)
];