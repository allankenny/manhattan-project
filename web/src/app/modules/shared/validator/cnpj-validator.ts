import { AbstractControl, FormControl, Validators } from '@angular/forms';

export class CnpjValidator {

  constructor() { }

  static validateCnpj() {
    return (control: AbstractControl): Validators => {
      const cnpj = control.value;
      const invalid: boolean = this.isInvalid(cnpj);
      return (invalid
        ? { cnpjNotValid: true }
        : null
      );
    };
  }

  static isValid(cnpj: string): boolean {
    if (cnpj) {
      // Valida DVs
      if (cnpj.length < 14) {
        return false;
      }
      let tamanho = cnpj.length - 2;
      let numeros = cnpj.substring(0, tamanho);
      const digitos = cnpj.substring(tamanho);
      let soma = 0;
      let pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += +numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) {
          pos = 9;
        }
      }
      let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado !== +digitos.charAt(0)) {
        return false;
      }
      tamanho = tamanho + 1;
      numeros = cnpj.substring(0, tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += +numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) {
          pos = 9;
        }
      }
      resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
      if (resultado !== +digitos.charAt(1)) {
        return false;
      }
    }
    return true;
  }

  static isInvalid(cnpj: string): boolean {
    return !this.isValid(cnpj);
  }

}
