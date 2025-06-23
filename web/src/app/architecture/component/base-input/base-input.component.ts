import { AbstractControl, FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';

/**
  Base comum entre componentes de campos de formulário.

  Esta component suporta acessibilidade utilizando o atributo 'accessibleLabel'
  como rótulo para leitores de tela. O atributo 'accessibleLabel' pode ser
  especificado pelo desenvolvedor, ou se deixado em branco passará a utilizar a
  informação do atributo 'label'.

  A acessibilidade deve ser aplicada em todos os herdeiros deste component
  colocando no elemento input do HTML os seguintes atributos:
  - '[attr.aria-invalid]' apontando para o método 'fieldIsInvalid';
  - '[attr.aria-label]' apontando para o método 'getAccessibleLabel';
  - '[attr.aria-required]' apontando para o método 'isRequired';
*/

@Component({
  template: ''
})
export abstract class BaseInput {

  /** Rótulo para leitores de tela (Acessibilidade). */
  @Input() accessibleLabel: string;

  /** Formulário a qual o input pertence. */
  @Input() form: FormGroup;

  /** Identificador do input no formulário. */
  @Input() identifier: string;

  /** Rótulo do input, repassado para o elemento '<label>'. */
  @Input() label: string;

  /**
    Atributo 'placeholder' do input.

    Recomenado não utilizar este atributo por questões de acessibilidade, porque
    o placeholder sempre é lido pelos leitores de tela independente da presença
    do atributo aria-label. Isto significa que ao colocar a informação no
    aria-label e no placeholder, o leitor de tela lia os dois, fazendo com que a
    informação fosse repetida duas vezes ao usuário.
  */
  @Input()
  public placeholder: string = '';

  @Input()
  public maxlength: number;

  /** Define se o input é somente leitura. */
  @Input()
  public readonly: boolean;

  constructor() {
  }

  getAccessibleLabel(): string {

    /**
      Se o rótulo para acessibilidade estiver em branco, preenchemos com a
      informação preenchida no label.
    */
    if (!this.accessibleLabel || this.accessibleLabel == '') {
      this.accessibleLabel = this.label;
    }

    return this.accessibleLabel;
  }

  getFormControl(): AbstractControl {

    if (this.identifier == undefined) {
      throw new Error('Undefined identifier on field labelled as "'+this.label+'".');
    }
    if (this.identifier == null) {
      throw new Error('Null identifier on field labelled as "'+this.label+'".');
    }

    if (this.form == undefined) {
      throw new Error('Undefined form for identifier "'+this.identifier+'" on field labelled as "'+this.label+'".');
    }
    if (this.form == null) {
      throw new Error('Null form defined for identifier "'+this.identifier+'" on field labelled as "'+this.label+'".');
    }

    const control: AbstractControl = this.form.get(this.identifier);
    if (!control) {
      throw new Error('AbstractControl not found for identifier "'+this.identifier+'" on field labelled as "'+this.label+'".');
    }
    return control;
  }

  /** Informa se o valor preenchido no input é inválido. */
  fieldIsInvalid(): boolean {
    const control: AbstractControl = this.getFormControl();
    return !control.valid && control.touched;
  }

  /** Informa se o input é de preenchimento obrigatório. */
  isRequired(): boolean {
    const control: AbstractControl = this.getFormControl();
    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }

    return false;
  }

  isDisabled(): boolean {
    const control: AbstractControl = this.getFormControl();
    return control.disabled || !control.enabled;
  }

  /** Obtém o valor do campo no formulário. */
  getValue(): any {
    return this.form.get(this.identifier).value;
  }

  /** Define o valor do campo no formulário. */
  setValue(value: any): void {

    /** Não permitir alterção se o campo for somente leitura ou desabilitado. */
    if (this.readonly) {
      return;
    }

    this.form.controls[this.identifier].setValue(value);
  }

}
