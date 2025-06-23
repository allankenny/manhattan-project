import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { PreBaseComponent } from './pre-base.component';
import { ObjectUtil } from '../../util/object-util';
import { BaseModel } from '../../../model/base-model';

@Component({
  template: ''
})
export abstract class BaseComponent extends PreBaseComponent {

  @Input() form: FormGroup;

  constructor() {
    super();
  }

  compareBaseModel(bm1: BaseModel, bm2: BaseModel) {
    return bm1 && bm2 && bm1.id && bm2.id && bm1.id === bm2.id;
  }

  /** Informa se formulário está inválido. Facilica a depuração de erros chamar este método e colocar breakpoint no "return true".
   * @param formGroup
   */
  isFormGroupInvalid(formGroup: FormGroup) {
    if (formGroup.invalid) {
      for (const field of Object.keys(formGroup.controls)) {
        const control: AbstractControl = formGroup.controls[field];
        if (control.enabled && control.invalid) {
          return true;
        }
      }

    }
    return false;
  }

  setFormGroup(formGroup: FormGroup) {
    this.form = formGroup;
  }

  fieldIsInvalid(field: string): Boolean {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  fieldIsInvalidIgnoreTouched(field: string): Boolean {
    if (this.form.get(field)) {
      return !this.form.get(field).valid;
    }

    return false;
  }

  getControl(formulario: FormGroup, nomeCampo: string): AbstractControl {
    if (!ObjectUtil.isEmpty(formulario)) {
      const campo: AbstractControl = formulario.get(nomeCampo);
      if (!ObjectUtil.isEmpty(campo)) {
        return formulario.get(nomeCampo);
      }
    }
    return null;
  }

  getValueForm(form: FormGroup, fieldName: string): any {
    const field = this.getControl(form, fieldName);
    if (!field) {
      return null;
    }
    return field.value;
  }

  getValueFormAsType<T>(form: FormGroup, fieldName: string, target: T): T {
    const field = this.getControl(form, fieldName);
    if (!field) {
      return null;
    }

    return Object.assign(target, field.value);
  }

  setValue(form: FormGroup, fieldName: string, value: any): void {
    const field = this.getControl(form, fieldName);
    if (!ObjectUtil.isEmpty(field)) {
      field.setValue(value);
    }
  }

  isFieldRequired(fielddName: string): boolean {
    const control = this.form.get(fielddName);
    if (control) {
      if (control.validator) {
        const validator = control.validator({} as AbstractControl);
        if (validator && validator.required) {
          return true;
        }
      }
    }

    return false;
  }


  setError(form: FormGroup, fieldName: string) {
    this.getControl(this.form, fieldName).setErrors({ 'incorrect': true });
  }

  cleanError(form: FormGroup, fieldName: string) {
    this.getControl(this.form, fieldName).setErrors(null);
  }

  onlyNumber(obj: any) {
    const val = obj.srcElement.value.replace(/[^\d]+/g, '');
    obj.target.value = val;
  }
  
  idHashtag(id: string): string {
    return id ? '#' + id : '';
  }

  showModal(id: string): void {
    (<any>$(this.idHashtag(id))).modal('show');
  }

  hideModal(id: string): void {
    (<any>$(this.idHashtag(id))).modal('hide');
  }

  protected forceValidateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
            this.forceValidateAllFormFields(control);
        }
    });
}

}
