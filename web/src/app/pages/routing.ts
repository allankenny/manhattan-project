import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  // {
  //   path: 'user',
  //   loadChildren: () =>
  //     import('./user/user.module').then((m) => m.UserModule),
  // },
  {
    path: 'ia-processing',
    loadChildren: () =>
      import('./ia-processing/ia-processing.module').then(
        (m) => m.IAprocessingModule
      ),
  },
  {
    path: 'audit',
    loadChildren: () =>
      import('./audit/audit.module').then(
        (m) => m.AuditModule
      ),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
