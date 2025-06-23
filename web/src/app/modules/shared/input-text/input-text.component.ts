import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { BaseInput } from '../../../architecture/component/base-input/base-input.component';

/**
  Component reutilizável de caixa de texto.
*/
@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent extends BaseInput {

  @Input() errorMessage: string;

  /** Emissor de Evento para quando o elemento HTML perder o foco. */
  @Output() blur: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
  }

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
