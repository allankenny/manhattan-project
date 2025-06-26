import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../../modules/i18n';
import { SharedModule } from '../../modules/shared/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxCurrencyDirective } from 'ngx-currency';
import { AuditComponent } from './audit.component';
import { AuditAnalyticComponent } from './audit-analytic/audit-analytic.component';
import { AuditShowEvidencesComponent } from './audit-show-evidences/audit-show-evidences.component';
import { AuditShowProductDetailsComponent } from './audit-show-product-details/audit-show-product-details.component';
import { AuditRoutingModule } from './audit-routing.module';

@NgModule({
  declarations: [
    AuditComponent,
    AuditAnalyticComponent,
    AuditShowEvidencesComponent,
    AuditShowProductDetailsComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuditRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    NgbDropdownModule,
    NgxChartsModule,
    NgxCurrencyDirective,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ],
})
export class AuditModule {}
