import { FormControl } from '@angular/forms';

export class DateValidator {

    static readonly PT_DATE_PATTERN =
    /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;

    static readonly HOUR_PATTERN =
    /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/g;


    static validateDate(control: FormControl): { [key: string]: any } {
        let valor = control.value;
        if (valor) {
            if (valor.length === 8) {
                const dia = valor.substring(0, 2);
                const mes = valor.substring(2, 4);
                const ano = valor.substring(4, 8);
                valor = dia + '/' + mes + '/' + ano;
            }

            if (!valor.match(DateValidator.PT_DATE_PATTERN)) {
                return { 'validateDate': true };
            }
        }
        return null;
    }

    static validateHour(control: FormControl): { [key: string]: any } {
        let valor = control.value;
        if (valor) {
            if (valor.length === 4) {
                const hora = valor.substring(0, 2);
                const minuto = valor.substring(2, 4);
                valor = hora + ':' + minuto;
            }

            if (!valor.match(DateValidator.HOUR_PATTERN)) {
                return { 'validateHour': true };
            }
        }
        return null;
    }
}
