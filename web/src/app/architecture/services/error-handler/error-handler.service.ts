import {Injectable} from '@angular/core';
import {Message} from '../message-notification/message';
import {Severity} from '../message-notification/severity.enum';
import {Router} from '@angular/router';
import { PreBaseComponent } from '../../component/base/pre-base.component';
import {SweetAlertResult} from 'sweetalert2';
import { AlertSwalService } from '../alert-swal/alert-swal.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService extends PreBaseComponent {

  constructor(
    private alertSwal: AlertSwalService,
    private router: Router) {
      super();
  }

  handle(error: any): Promise<SweetAlertResult> {
    if (error.status === 200) {
      return;
    }
    if (error.status === 401) {

      this.signOut(this.router);
      this.alertSwal.error(`Sessão do usuário expirou, favor efetuar login novamente`);

      return;
    }

    const text = error.error.detail || error.text || (error.error ? error.error.message : null) || error.message;
    const detail = error.status ? `Status: ${error.status} - ${error.statusText}` : '';

    const message: Message = new Message(Severity.ERROR, text, detail);
    return this.alertSwal.error(`${message.summary}`);
  }

  /**
   * Special handle for knock rails gem
   */
  handleAuthentication(error: any) {
    if (error.status === 401) {
      this.alertSwal.error('Erro de autenticação. Usuário ou senha inválidos');
    } else {
      this.handle(error);
    }
  }
}
