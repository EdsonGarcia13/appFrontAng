import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'tasks',
    loadComponent: () => import('./features/task/task.component')
      .then(m => m.TaskComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  }
];
