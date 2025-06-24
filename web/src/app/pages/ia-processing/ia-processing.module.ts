import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../../modules/i18n';
import { SharedModule } from '../../modules/shared/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IAprocessingComponent } from './ia-processing.component';
import { IAprocessingRoutingModule } from './ia-processing-routing.module';
import { IAprocessingAnalyticComponent } from './ia-processing-analytic/ia-processing-analytic.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { IAProcessingShowEvidencesComponent } from './ia-processing-show-evidences/ia-processing-show-evidences.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { IAProcessingShowProductDetailsComponent } from './ia-processing-show-product-details/ia-processing-show-product-details.component';

@NgModule({
  declarations: [
    IAprocessingComponent,
    IAprocessingAnalyticComponent,
    IAProcessingShowEvidencesComponent,
    IAProcessingShowProductDetailsComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    IAprocessingRoutingModule,
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
export class IAprocessingModule {}
