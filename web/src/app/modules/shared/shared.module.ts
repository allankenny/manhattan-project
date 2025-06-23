import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslationModule } from '../i18n/translation.module';
import { PagerComponent } from './pager/pager.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputTextComponent } from './input-text/input-text.component';
import { ImportResultComponent } from './import-result/import-result.component';
import { InputCheckboxBooleanComponent } from './input-checkbox-boolean/input-checkbox-boolean.component';
import { InputSelectBooleanComponent } from './input-select-boolean/input-select-boolean.component';
import { InputSelectComponent } from './input-select/input-select.component';
import { SimNaoPipe } from './pipe/sim-nao.pipe';
import { InputMaskComponent } from './input-mask/input-mask.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CpfPipe } from './pipe/cpf.pipe';
import { CnpjPipe } from './pipe/cnpj.pipe';
import { InputPhoneComponent } from './input-phone/input-phone.component';
import { InputPasswordComponent } from './input-password/input-password.component';
import { InputCpfComponent } from './input-cpf/input-cpf.component';
import { InputCnpjComponent } from './input-cnpj/input-cnpj.component';
import { InputSearchSelectComponent } from './input-search-select/input-search-select.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { InputCurrencyComponent } from './input-currency/input-currency.component';
import { NgxCurrencyDirective } from "ngx-currency";
import { InputSelectFilterComponent } from './input-select-filter/input-select-filter.component';
import { InputDateComponent } from './input-date/input-date.component';
import { ReadMoreComponent } from './read-more/read-more.component';
import { InputToggleBooleanComponent } from './input-toggle-boolean/input-toggle-boolean.component';
import { InputSelectMultipleFilterComponent } from './input-select-multiple-filter/input-select-multiple-filter.component';
import { InputCalendarComponent } from './input-calendar/input-calendar.component';
import { RealCurrencyPipe } from './pipe/currency.pipe';

@NgModule({
  declarations: [
    PagerComponent,
    InputTextComponent,
    ImportResultComponent,
    InputCheckboxBooleanComponent,
    InputSelectBooleanComponent,
    InputSelectComponent,
    InputSelectFilterComponent,
    InputMaskComponent,
    InputPhoneComponent,
    InputPasswordComponent,
    InputCpfComponent,
    InputCnpjComponent,
    InputSearchSelectComponent,
    InputCurrencyComponent,
    InputDateComponent,
    InputSelectMultipleFilterComponent,
    ReadMoreComponent,
    SimNaoPipe,
    CpfPipe,
    CnpjPipe,
    InputToggleBooleanComponent,
    InputCalendarComponent,
    RealCurrencyPipe
  ],
  imports: [
    CommonModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgSelectModule,
    AutocompleteLibModule,
    NgxCurrencyDirective,
    NgbDatepickerModule,

  ],
  exports: [
    PagerComponent,
    InputTextComponent,
    ImportResultComponent,
    InputCheckboxBooleanComponent,
    InputSelectBooleanComponent,
    InputSelectComponent,
    InputSelectFilterComponent,
    InputMaskComponent,
    InputPhoneComponent,
    InputPasswordComponent,
    InputCpfComponent,
    InputCnpjComponent,
    InputSearchSelectComponent,
    InputCurrencyComponent,
    InputDateComponent,
    InputSelectMultipleFilterComponent,
    ReadMoreComponent,
    SimNaoPipe,
    CpfPipe,
    CnpjPipe,
    InputToggleBooleanComponent,
    InputCalendarComponent,
    RealCurrencyPipe
  ],
  providers: [provideNgxMask()]
})
export class SharedModule { }
