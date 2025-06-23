import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'realCurrency'
})
export class RealCurrencyPipe implements PipeTransform {
  transform(value: number | string, showSymbol: boolean = true): string {
    if (value === null || value === undefined) return '';

    const formattedValue = Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return showSymbol ? formattedValue : formattedValue.replace('R$', '').trim();
  }
}
