import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Message} from './message-notification/message';
import { PageInfo } from '../model/page-info';

@Injectable()
export abstract class ViewSetService<T> extends BaseService {

  protected abstract baseURL(): string;

  constructor(protected httpClient: HttpClient) {
    super();
  }

  create(model: T): Observable<T> {
    return this.httpClient.post<T>(this.url() + '/', JSON.stringify(model), this.deductHeader());
  }

  update(model: T & {id: string}): Observable<T> {
    return this.httpClient.put<T>(this.url() + `/${model.id}/`, JSON.stringify(model), this.deductHeader());
  }

  read(key: string): Observable<T> {
    return this.httpClient.get<T>(this.url() + '/' + key, this.deductHeader());
  }

  list(pageInfo: PageInfo): Observable<any> {
    return this.httpClient.get<any>(this.url(), this.deductHeaderWithPagination(pageInfo));
  }

  pagedList(pageInfo: PageInfo): Observable<any> {
    return this.httpClient.get<any>(this.url(), this.deductHeaderWithPagination(pageInfo));
  }

  remove(key: string): Observable<Message> {
    return this.httpClient.delete<Message>(this.url() + '/' + key, this.deductHeader());
  }

  protected url() {
    return this.startUrl() + this.baseURL();
  }
}
