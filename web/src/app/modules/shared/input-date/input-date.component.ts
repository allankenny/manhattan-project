import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { BaseInput } from '../../../architecture/component/base-input/base-input.component';

/**
  Component reutilizável de caixa de texto para datas no formato 'DD/MM/AAAA'.
*/
@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss']
})
export class InputDateComponent extends BaseInput {

  /** Máscara padrão para datas no fromato DD/MM/AAAA */
  static readonly MASCARA_DATA = '00/00/0000';

  @Input() errorMessage: string;
  @Output() blur: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
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

  public getDateMask(): string {
    return InputDateComponent.MASCARA_DATA;
  }

}
