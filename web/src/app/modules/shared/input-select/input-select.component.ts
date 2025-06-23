import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Model} from '../../../model/model';
import { BaseInput } from '../../../architecture/component/base-input/base-input.component';

/**
  Component reutilizável de caixa de seleção (combo box).
*/
@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss']
})
export class InputSelectComponent extends BaseInput {

  /**
    Conversor para converter objeto para string que servirá como rótulo do item.
  */
  @Input() converter: Function;

  /** Lista de objetos que serão exibidos como opções na lista. */
  @Input() options: any[];

  /** Exibição da opção com valor null. */
  @Input() showNullOption: boolean = true;

  /** Emissor de Evento para quando a opção selecionada for alterada. */
  @Output() change: EventEmitter<any> = new EventEmitter();

  /** Emissor de Evento para quando usuário desfocar do campo. */
  @Output() focusout: EventEmitter<any> = new EventEmitter();

  /**
    Conversor para converter objeto para string que servirá como informação de
    orientação no 'title' do item.
  */
  @Input() titleConverter: Function;

  @Input() labelSelecione = 'Selecione';

  /** Função de comparação para verificar se dois objetos são o mesmo. */
  @Input() compareWith: Function = (x: any, y: any) => {
    if (x === y) {
      return true;
    }
    return (x as Model<any>)?.id === (y as Model<any>)?.id;
  };

  /** Conversor para caso o 'converter' não tenha sido especificado. */
  private defaultConverter = (option: any): string => option;

  @Input() crossedOutTextSetter: Function = (item: any): boolean => false;

  /**
    Obtem um rótulo a partir de um objeto.

    Caso o converter não tenha sido especificado, este métood utilizará o
    defaultConverter. O ideal é que o converter seja especificado para o rótulo seja exibido
    apropriadamente.
  */
  getItemLabel(obj: any): string {
    if (!this.converter) {
      return this.defaultConverter(obj);
    }

    return this.converter(obj);
  }

  /**
    Obtem uma informação de orientação a partir de um objeto para ser exibida
    no atributo 'title'.

    Caso o converter não tenha sido especificado, este méotodo retornará uma
    string vazia.
    */
  getItemTitle(obj: any): string {
    if (!this.titleConverter) {
      return '';
    }

    return this.titleConverter(obj);
  }

  onChange(): void {
    if (this.change) {
      this.change.emit();
    }
  }

  onFocusOut(): void {
    if (this.focusout) {
      this.focusout.emit();
    }
  }

  isItemWithCrossedOutText(item): boolean {
    if (this.crossedOutTextSetter) {
      return this.crossedOutTextSetter(item) === true;
    }
    return false;
  }

  isSelectedItemWithCrossedOutText(): boolean {
    if (this.identifier) {
      const item: any = this.form.get(this.identifier).value;
      if (item) {
        return this.isItemWithCrossedOutText(item);
      }
    }
    return false;
  }

}
