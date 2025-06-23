import {Component, Input} from '@angular/core';
import {InputTextComponent} from '../input-text/input-text.component';

/**
 Component reutilizável de caixa de texto com máscara.
 */
@Component({
  selector: 'app-input-mask',
  templateUrl: './input-mask.component.html',
  styleUrls: ['./input-mask.component.scss']
})
export class InputMaskComponent extends InputTextComponent {

  /** Máscara a ser utilizada pelo input. */
  @Input() mask: string;

  /** Usado para adicionar caracteres especiais, caso for passado uma string vazia o componente nao ira aceitar nenhum caracter especial. */
  @Input() specialCharacters: string[];

  constructor() {
    super();
  }

  getErrorMessage() {
    if (this.errorMessage) {
      return this.errorMessage;
    }
    return `${this.label} inválida`;
  }

}
