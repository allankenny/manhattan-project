import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Constants } from '../../../architecture/util/constants';
import { BaseService } from '../../../architecture/services/base.service';
import {HttpClient} from '@angular/common/http';
import { AuthHTTPService } from './auth-http';
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/user';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  // public fields
  currentUser$: Observable<User>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<User>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: User) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authHttpService: AuthHTTPService,
    private userService: UserService
  ) {
    super();
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<User>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  login(params): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.httpClient.post<any>(this.urlToken(), JSON.stringify(params), {headers: this.headers()}).pipe(
      map((resp: any) => {
        if(resp && resp.access) {
          localStorage.setItem(Constants.TOKEN_TRADEX, JSON.stringify(resp));
        }
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(Constants.TOKEN_TRADEX);
    localStorage.removeItem(Constants.CURRENT_USER_TRADEX);
    localStorage.removeItem(Constants.USER_DETAIL_TRADEX);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<User> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access) {
      return of(undefined);
    }
    this.isLoadingSubject.next(true);
    const decoded: any = jwt_decode(auth.access);

    return this.userService.read(decoded.user_id).pipe(
      map((user: User) => {
        if (user) {
          localStorage.setItem(Constants.CURRENT_USER_TRADEX, JSON.stringify(user));
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  // registration(user: UserModel): Observable<any> {
  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService.createUser(user).pipe(
  //     map(() => {
  //       this.isLoadingSubject.next(false);
  //     }),
  //     switchMap(() => this.login(user.email, user.password)),
  //     catchError((err) => {
  //       console.error('err', err);
  //       return of(undefined);
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }

  // private methods
  // private setAuthFromLocalStorage(auth: AuthModel): boolean {
  //   // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
  //   if (auth && auth.authToken) {
  //     localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
  //     return true;
  //   }
  //   return false;
  // }

  private getAuthFromLocalStorage(): any | undefined {
    try {
      const lsValue = localStorage.getItem(Constants.TOKEN_TRADEX);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  resetPassword(email:string): Observable<Object> {
    return this.httpClient.get(this.urlResetPassword(), {
      params: {
        email: email
      },
      headers: this.headers()});
  }

  private urlResetPassword() {
    return this.startUrl() + '/password_reset_request/';
  }

  private urlCurrent(): string {
    return this.startUrl() + '/auth/current';
  }

  private urlUsers(): string {
    return this.startUrl() + '/auth/signup';
  }

  private urlToken(): string {
    return this.startUrl() + '/login/';
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
