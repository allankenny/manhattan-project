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
export class UserService extends CrudService<User> {

  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  protected baseURL(): string {
    return '/user';
  }

  pagedFilterList(pageInfo: PageInfo, filter: FilterUser): Observable<any> {
    return this.httpClient.get<any>(this.url(), this.deductHeaderWithParams(this.getParams(pageInfo, filter)));
  }

  createFormData(model: User): Observable<any> {
    return this.httpClient.post<any>(this.url() + '/create', JSON.stringify(model), this.deductHeader());
  }

  passwordUpdate(model: User): Observable<any> {
    return this.httpClient.put<any>(this.url() + '/password_update', JSON.stringify(model), this.deductHeader());
  }

  getParams(pageInfo: PageInfo, filter: FilterUser) {
    const params: Record<string, any> = {
      'page_size': pageInfo.pageSizeCards,
      'page': pageInfo.actualPage,
    };

    if(filter.name) {
      params.name = filter.name;
    }

    if(filter.cpf) {
      params.cpf = filter.cpf;
    }

    if(filter.username) {
      params.username = filter.username;
    }

    if(filter.email) {
      params.email = filter.email;
    }

    if(filter.is_active !== null) {
      params.isActive = filter.is_active.toString();
    }
    return params;
  }

  private createObjectFormData(model: User) {
    const formData = new FormData();
    formData.append('id', model.id);
    formData.append('email', model.email);
    formData.append('first_name', model.first_name);
    formData.append('last_name', model.last_name);
    formData.append('username', model.username);
    formData.append('avatar', model.avatar);
    return formData;
  }

}
