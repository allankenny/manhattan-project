import { Pipe, PipeTransform } from '@angular/core';
import { StringUtil } from '../../../architecture/util/string-util';

@Pipe({
  name: 'cpf'
})
export class CpfPipe implements PipeTransform {

  transform(value, hideAfterThreeDigits: boolean = true): string {
    if (value) {
      let ret: string = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '\$1.\$2.\$3\-\$4');
      if (hideAfterThreeDigits) {
        ret = StringUtil.replaceDigitsAndLetters(
          ret,
          '*',
          3
        );
      }
      return ret;
    }
    return '';
  }

}
