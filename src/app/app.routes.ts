import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
//import { CourseDetailComponent } from './features/course-detail/course-detail.component';
//import { SettingsComponent } from './features/settings/settings.component';
//import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  //{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  //{ path: 'course/:id/:source', component: CourseDetailComponent, canActivate: [AuthGuard] },
  //{ path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];
