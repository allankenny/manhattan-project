import {Component, OnInit} from '@angular/core';
import {InputTextComponent} from '../input-text/input-text.component';
import {AbstractControl} from '@angular/forms';
import { CnpjValidator } from '../validator/cnpj-validator';

/**
  Component reutilizável de caixa de texto para documentos CNPJ.
*/
@Component({
  selector: 'app-input-cnpj',
  templateUrl: './input-cnpj.component.html',
  styleUrls: ['./input-cnpj.component.scss']
})
export class InputCnpjComponent extends InputTextComponent implements OnInit {

  /** Máscara padrão para documentos CNPJ. */
  static readonly MASCARA_CNPJ: string = '00.000.000/0000-00';

  constructor() {
    super();
  }

  ngOnInit(): void {

    if (this.identifier == null || this.identifier === '') {
      this.identifier = 'cnpj'; // Identificação padrão
    }
    if (this.label == null || this.label === '') {
      this.label = 'CNPJ'; // Rótulo padrão
    }

    /**
      Tamanho máximo deve ser sempre a quantidade de caracteres do CNPJ,
      incluindo dígitos, pontos e o traço.
    */
    this.maxlength = InputCnpjComponent.MASCARA_CNPJ.length;
  }

  public getCnpjMask(): string {
    return InputCnpjComponent.MASCARA_CNPJ;
  }

  onChange(): void {

    const cnpj: string = this.getValue();

    const formControl: AbstractControl = this.getFormControl();
    formControl.updateValueAndValidity();
    if (cnpj) {
      if (CnpjValidator.isValid(cnpj)) {
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
