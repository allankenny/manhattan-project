import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simNao'
})
export class SimNaoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value && value === true ? 'Sim' : 'Não';
  }
}
