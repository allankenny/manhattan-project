import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { BaseInput } from '../../../architecture/component/base-input/base-input.component';

/**
  Component reutilizável de caixa de texto para datas no formato 'DD/MM/AAAA'.
*/
@Component({
  selector: 'app-input-calendar',
  templateUrl: './input-calendar.component.html',
  styleUrls: ['./input-calendar.component.scss']
})
export class InputCalendarComponent extends BaseInput {


  @Input() errorMessage: string;
  @Output() blur: EventEmitter<any> = new EventEmitter();

  minPickerDate: any;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.minPickerDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
  }

  // ngOnInit(): void {
  //   /** Tamanho máximo de caracteres sendo compatível com a máscara. */
  //   this.maxlength = InputDateComponent.MASCARA_DATA.length;
  // }

  onBlur() {
    if (this.blur) {
      this.blur.emit();
    }
  }

  getErrorMessage() {
    if (this.errorMessage) {
      return this.errorMessage;
    }
    return `${this.label} inválida`;
  }


}
