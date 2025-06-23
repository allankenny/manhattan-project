import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { CrudService } from '../architecture/services/crud.service';
import { PageInfo } from '../architecture/model/page-info';
import { FilterUser } from '../model/filter/user.filter';

@Injectable({
  providedIn: 'root'
})
export class ExecutionsService extends CrudService<any> {

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  protected baseURL(): string {
    return '/executions';
  }

  getList(): Observable<any> {
    return this.httpClient.get<any>(this.url(), this.deductHeader());
  }

  processExecution(execution: string): Observable<any> {
    return this.httpClient.post<any>(`${this.url()}/process/by-name/${execution}`,this.deductHeader());
  }

  getDataIaProcessing(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.url()}/${id}`, this.deductHeader());
  }

  setFacesAudit(executionId: string, data: any[]): Observable<any> {
    return this.httpClient.post<any>(
      `${this.url()}/${executionId}/audit/brands`,
      data,
      this.deductHeader()
    );
  }

  setFacesAndPriceAudit(executionId: string, data: any[]): Observable<any> {
    return this.httpClient.post<any>(
      `${this.url()}/${executionId}/audit/products`,
      data,
      this.deductHeader()
    );
  }

}
