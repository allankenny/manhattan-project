import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IAprocessingComponent } from './ia-processing.component';
import { IAprocessingAnalyticComponent } from './ia-processing-analytic/ia-processing-analytic.component';


const routes: Routes = [
  {
    path: '',
    component: IAprocessingComponent,
  },
  { path: 'analytic/:id',
    component: IAprocessingAnalyticComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IAprocessingRoutingModule {}
