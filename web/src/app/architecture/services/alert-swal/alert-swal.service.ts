import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

export enum Severity {
    SUCCESS = 'success',
    INFO = 'info',
    WARN = 'warning',
    ERROR = 'error'
}

@Injectable()
export class AlertSwalService {

    readonly dismissReasonCancel = 'cancel';

    alertSwal(titleAlert: string, messageAlert: string, typeAlert?: any): Promise<SweetAlertResult> {
      if (!typeAlert) {
        typeAlert = Severity.INFO;
      }
        return Swal.fire({
            'title': titleAlert,
            'html': messageAlert,
            'icon': typeAlert,
            'showCloseButton': true,
            'showConfirmButton': true,
            backdrop: `
                rgba(211,211,211,0.4)
                center left
                no-repeat
            `,
        });
    }

    confirm(titleAlert: string, messageAlert: string): Promise<any> {
        return Swal.fire({
            'title': titleAlert,
            'text': messageAlert,
            'icon': Severity.WARN,
            iconColor: '#f1bc00',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar',
            confirmButtonAriaLabel: 'Confirmar',
            cancelButtonAriaLabel: 'Cancelar',
            confirmButtonColor: '#0e7490',
            cancelButtonColor: '#99A1B7',
            reverseButtons: true,
            backdrop: `
                rgba(211,211,211,0.4)
                center left
                no-repeat
            `,
        });
    }

    alertToast(toastTitle: string, toastType: any): Promise<SweetAlertResult> {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        return toast.fire({
            icon: toastType,
            title: toastTitle
        });
    }

    info(message: string): Promise<SweetAlertResult> {
        return this.alertSwal('Informação', message, Severity.INFO);
    }

    warn(message: string): Promise<SweetAlertResult> {
        return this.alertSwal('Aviso', message, Severity.WARN);
    }

    error(message: string): Promise<SweetAlertResult> {
        return this.alertSwal('Erro', message, Severity.ERROR);
    }

    success(message: string): Promise<SweetAlertResult> {
        return this.alertSwal('Sucesso', message, Severity.SUCCESS);
    }

    infoToast(title: string) {
        return this.alertToast(title, Severity.INFO);
    }

    warnToast(title: string): Promise<SweetAlertResult> {
        return this.alertToast(title, Severity.WARN);
    }

    errorToast(title: string): Promise<SweetAlertResult> {
        return this.alertToast(title, Severity.ERROR);
    }

    successToast(title: string): Promise<SweetAlertResult> {
        return this.alertToast(title, Severity.SUCCESS);
    }
}
