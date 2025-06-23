import {Component, EventEmitter, Input, Output} from '@angular/core';
import { BaseInput } from '../../../architecture/component/base-input/base-input.component';

/**
  Component reutilizável de checkbox.
*/
@Component({
  selector: 'app-input-toggle-boolean',
  templateUrl: './input-toggle-boolean.component.html',
  styleUrls: ['./input-toggle-boolean.component.scss']
})
export class InputToggleBooleanComponent extends BaseInput {

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
