import {Component, OnInit} from '@angular/core';
import {InputTextComponent} from '../input-text/input-text.component';
import {AbstractControl} from '@angular/forms';
import { CpfValidator } from '../validator/cpf-validator';

/**
  Component reutilizável de caixa de texto para documentos CPF.
*/
@Component({
  selector: 'app-input-cpf',
  templateUrl: './input-cpf.component.html',
  styleUrls: ['./input-cpf.component.scss']
})
export class InputCpfComponent extends InputTextComponent implements OnInit {

  /** Máscara padrão para documentos CPF. */
  static readonly MASCARA_CPF: string = '000.000.000-00';

  constructor() {
    super();
  }

  ngOnInit(): void {

    if (this.identifier == null || this.identifier === '') {
      this.identifier = 'cpf'; // Identificação padrão
    }
    if (this.label == null || this.label === '') {
      this.label = 'CPF'; // Rótulo padrão
    }

    /**
      Tamanho máximo deve ser sempre a quantidade de caracteres do CPF,
      incluindo dígitos, pontos e o traço.
    */
    this.maxlength = InputCpfComponent.MASCARA_CPF.length;
  }

  public getCpfMask(): string {
    return InputCpfComponent.MASCARA_CPF;
  }

  onChange(): void {

    const cpf: string = this.getValue();

    const formControl: AbstractControl = this.getFormControl();
    formControl.updateValueAndValidity();
    if (cpf) {
      if (CpfValidator.isValid(cpf)) {
        formControl.setErrors(null);
      } else {
        formControl.setErrors({'incorrect': true});
      }
    } else {
      if (this.isRequired()) {
        formControl.setErrors({'incorrect': true});
      } else {
        formControl.setErrors(null);
      }
    }
  }

}
