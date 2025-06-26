import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditComponent } from './audit.component';
import { AuditAnalyticComponent } from './audit-analytic/audit-analytic.component';

const routes: Routes = [
  {
    path: '',
    component: AuditComponent,
  },
  { path: 'analytic/:id',
    component: AuditAnalyticComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditRoutingModule {}
