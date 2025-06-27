import { NgModule, APP_INITIALIZER, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { LoaderService } from './architecture/services/loader/loader.service';
import { LoaderInterceptor } from './architecture/interceptors/loader-interceptor';
import { RefreshTokenInterceptor } from './architecture/interceptors/refresh-token-interceptor';
// #fake-end#
import * as $ from 'jquery';
import { AlertSwalService } from './architecture/services/alert-swal/alert-swal.service';
import { ErrorHandlerService } from './architecture/services/error-handler/error-handler.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NG_PROGRESS_CONFIG, NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
$;
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { CustomDateParserFormatter } from './architecture/date-formetter/custom-date-parser-formatter';
import { NgxCurrencyInputMode, NgxCurrencyConfig, provideEnvironmentNgxCurrency } from 'ngx-currency';
import { FormsModule } from '@angular/forms';

registerLocaleData(localePt);


function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      //@ts-ignore
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

const customCurrencyConfig: NgxCurrencyConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.',
  nullable: false,
  inputMode: NgxCurrencyInputMode.Natural
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
          passThruUnknownUrl: true,
          dataEncapsulation: false,
        })
      : [],
    // #fake-end#
    AppRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    InlineSVGModule.forRoot(),
    NgbModule,
    NgSelectModule,
    NgProgressModule,
    NgxChartsModule,
    FormsModule
  ],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: appInitializer,
    //   multi: true,
    //   deps: [AuthService],
    // },
    {provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    importProvidersFrom(NgProgressHttpModule, NgProgressRouterModule),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: NG_PROGRESS_CONFIG,
      useValue: {
        spinnerPosition: 'left',
        color: '#0e7490'
      }
    },
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    LoaderService,
    AlertSwalService,
    ErrorHandlerService,
    provideEnvironmentNgxCurrency(customCurrencyConfig)
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
