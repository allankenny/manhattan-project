import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpHeaders} from '@angular/common/http';
import { Constants } from '../util/constants';
import { PageInfo } from '../model/page-info';

@Injectable()
export abstract class BaseService {

  protected startUrl(): string {
    return `${environment.protocol + environment.host}:${environment.port}${environment.baseURL}`;
  }

  protected startPublicUrl(): string {
    return `${environment.protocol + environment.host}:${environment.port}${environment.baseURL}/public`;
  }

  protected deductHeaderWithPagination(pageInfo: PageInfo) {
    return {headers: this.hasToken()? this.securityHeaders() : this.headers(),
    params: {
      'page_size': pageInfo.pageSize,
      'page': pageInfo.actualPage,
      'ordering': pageInfo.ordering
    }};
  }

  protected deductHeaderWithParams(params: any) {
    return {headers: this.hasToken()? this.securityHeaders() : this.headers(),
      params: params
    }
  }

  protected deductHeader() {
    return {headers: this.hasToken() ? this.securityHeaders() : this.headers()};
  }

  protected deductHeaderFormData() {
    return {headers: this.hasToken() ? this.securityHeadersFormData() : this.headersFormData()};
  }

  protected headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  protected headersFormData(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    });
  }

  protected headersWithPagination(pageInfo: PageInfo): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'page': pageInfo.actualPage.toString(),
      'pageSize': pageInfo.pageSize.toString(),
    });
  }

  /**
   * Retorn header with Authorization token.
   *
   * @returns headers
   */
  protected securityHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.getToken()
    });
  }

  protected securityHeadersFormData() {
    return new HttpHeaders({
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryZwqQx5ZxdC4wH7Fh',
      'Authorization': 'Bearer ' + this.getToken()
    });
  }

  protected getCurrentToken() {
    const ret = localStorage.getItem(Constants.TOKEN_TRADEX);
    if (ret) {
      return JSON.parse(ret);
    }

    return null;
  }

  /**
   * Retorna o currentUser.
   */
  protected getCurrentUser() {
    const ret = localStorage.getItem(Constants.CURRENT_USER_TRADEX);
    if (ret) {
      return JSON.parse(ret);
    }

    return null;
  }

  /**
   * Retorna o token armazenado no localStorage.
   *
   */
  protected getToken(): string {
    const token = this.getCurrentToken();
    if (token) {
      return token.access;
    }

    return null;
  }

  /**
   * Verifica se existe token armazenado no localStorage.
   *
   * @returns false indica que nao existe token
   */
  hasToken(): boolean {
    const jwt = this.getToken();

    return jwt != null && jwt !== '';
  }

  /**
   * Sanitiza um valor que será passado para URL.
   * 
   * @param value 
   * @returns Valor sanitizado
   */
  protected sanitizeValueForURL(value: string): string {
    if (value) {
      value = value.replace('\\',' ');
      value = value.replace('/',' ');
      value = value.replace('(',' ');
      value = value.replace(')',' ');
      value = value.replace('[',' ');
      value = value.replace(']',' ');
    }
    return value;
  }

  protected customHeaderFormData(): any {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.getToken()
    });
    return { headers: headers }
  }

}
