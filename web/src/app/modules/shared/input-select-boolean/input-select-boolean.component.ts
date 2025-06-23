import {Component, EventEmitter, Input, Output} from '@angular/core';
import { BaseInput } from '../../../architecture/component/base-input/base-input.component';

/**
  Component reutilizável de caixa de seleção (combo box) para valores boolean.
*/
@Component({
  selector: 'app-input-select-boolean',
  templateUrl: './input-select-boolean.component.html',
  styleUrls: ['./input-select-boolean.component.scss']
})
export class InputSelectBooleanComponent extends BaseInput{

  /** Emissor de Evento para quando a opção selecionada for alterada. */
  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Rótulo para opção com valor true. */
  @Input() trueOptionLabel: string = 'Sim';

  /** Rótulo para opção com valor false. */
  @Input() falseOptionLabel: string = 'Não';

  onChange(event: boolean) {
    if (this.change) {
      this.change.emit(event);
    }
  }

  // getAccessibleLabel(): string {
  //   let ret: string = super.getAccessibleLabel();
  //   if (!this.showNullOption) {
  //     ret += ', marcado como \"'
  //       +
  //       this.getValue() ? this.trueOptionLabel : this.falseOptionLabel
  //       +
  //       '\"'
  //     ;
  //   }
  //   return ret;
  // }

}
