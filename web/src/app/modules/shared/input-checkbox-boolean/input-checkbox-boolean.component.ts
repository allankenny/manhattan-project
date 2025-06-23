import {Component, EventEmitter, Input, Output} from '@angular/core';
import { BaseInput } from '../../../architecture/component/base-input/base-input.component';

/**
  Component reutilizável de checkbox.
*/
@Component({
  selector: 'app-input-checkbox-boolean',
  templateUrl: './input-checkbox-boolean.component.html',
  styleUrls: ['./input-checkbox-boolean.component.scss']
})
export class InputCheckboxBooleanComponent extends BaseInput {

  /** Emissor de Evento para quando a opção selecionada for alterada. */
  @Output() change: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
  }

  onChange() {
    if (this.change) {
      this.change.emit();
    }
  }

}
