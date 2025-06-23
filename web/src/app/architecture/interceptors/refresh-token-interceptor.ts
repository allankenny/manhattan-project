import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import { Constants } from '../util/constants';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body.refreshToken) {
            this.updateTokenCurrentUser(event.body.refreshToken);
          }
        }

        return event;
      })
    );
  }

  private updateTokenCurrentUser(refreshToken: string) {
    const userStr = localStorage.getItem(Constants.CURRENT_USER_TRADEX);
    if (userStr !== undefined && userStr !== null) {
      const curUser = JSON.parse(userStr);
      curUser.token = refreshToken;
      localStorage.setItem(Constants.CURRENT_USER_TRADEX, JSON.stringify(curUser));
    }
  }
}
