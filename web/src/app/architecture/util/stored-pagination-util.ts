import {AbstractControl, FormGroup} from '@angular/forms';
import {NamedValue} from '../model/named-value';
import {StoredPagination} from '../model/stored-pagination';
import { PageInfo } from '../model/page-info';

export class StoredPaginationUtil {

  protected static readonly PAGINATION_SESSION_NAME: string = 'storedPaginationTradex';

  /** Amarzena informações sobre a última paginação do usuário. */
  public static storePagination(pageInfo: PageInfo, form: FormGroup): void {
    this.clearStoredPagination();

    if (pageInfo || form) {

      const address: string = this.getCurrentAddress();
      const formValues: NamedValue[] = [];
      Object.keys(form.controls).forEach(key => {
        const formControl: AbstractControl = form.get(key);
        formValues.push(new NamedValue(key, formControl.value));
      });

      const pagination: StoredPagination = new StoredPagination(address, pageInfo, formValues);
      localStorage.setItem(StoredPaginationUtil.PAGINATION_SESSION_NAME, JSON.stringify(pagination));
    }
  }

  /** Recupera informações sobre a paginação da última consulta do usuário. */
  public static recoverPagination(): StoredPagination {
    const paginationJSON: string = localStorage.getItem(StoredPaginationUtil.PAGINATION_SESSION_NAME);

    let pagination: StoredPagination;
    if (paginationJSON) {
      pagination = StoredPagination.fromJSON(paginationJSON);

      if (!pagination.getAddress() || pagination.getAddress() !== this.getCurrentAddress()) {
        return null;
      }
    }
    return pagination;
  }

  /** Limpa a session sobre a paginação da última consulta do usuário. */
  public static clearStoredPagination(): void {
    localStorage.removeItem(StoredPaginationUtil.PAGINATION_SESSION_NAME);
  }

  /** Obtém o endereço atual da página. */
  protected static getCurrentAddress(): string {
    return window.location.href;
  }

  public static getParametersUrl(url: string): string[] {
    const parameter = url.substring(url.indexOf('?') + 1);
    const parameters = parameter.split('&');
    return parameters;
  }

}
