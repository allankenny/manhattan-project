import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import { BaseInput } from '../../../architecture/component/base-input/base-input.component';
import { NgxCurrencyDirective } from 'ngx-currency';


/**
  Component reutilizável de caixa de texto para valores monetários.
*/
@Component({
  selector: 'app-input-currency',
  templateUrl: './input-currency.component.html',
  styleUrls: ['./input-currency.component.scss'],
})
export class InputCurrencyComponent extends BaseInput {

  @Input() isError = false;
  @Input() errorMessage: string;
  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Input() options = { prefix: 'R$ ', thousands: '.', decimal: ',', allowNegative: false };

  constructor() {
    super();
  }

  onBlur() {
    if (this.blur) {
      this.blur.emit();
    }
  }

  onFocusIn(): void {
   this.checkAndNotifyChanges();
  }

  onFocusOut(): void {
    this.checkAndNotifyChanges();
  }

  // O NgxCurrencyModule não possui trigger funcional de change events, tive que recriar um aqui.
  // Lembrando que o trigger de change events que queremos é um que ative SOMENTE se houver alterações INSERIDAS PELO USUÁRIO.
  // Se um dia os devs desse framework corrigirem isso, ai vocês podem tirar o código abaixo.
  private previousForm: FormGroup;
  private previousValue: any;
  private readonly CHANGES_TIMEOUT: number = 300;
  private lastChangeCheck: number = new Date().getTime();
  private checkAndNotifyChanges() {
    const currentTime: number = new Date().getTime();
    if (currentTime - this.lastChangeCheck >= this.CHANGES_TIMEOUT) {
      this.lastChangeCheck = currentTime;
      const currentValue: any = this.getValue();
      const previousValue: any = this.previousValue;
      const previousForm: FormGroup = this.previousForm;
      if (this.change) {
        if (    previousForm !== undefined
            &&  previousValue !== undefined
        ) {
          if (    this.form === previousForm
              &&  currentValue !== previousValue
              &&  currentValue === this.getValue()
          ) {
            this.change.emit();
          }
        }
      }
      this.previousValue = currentValue;
      this.previousForm = this.form;
    }
  }

}
