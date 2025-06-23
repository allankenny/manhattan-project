import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Constants } from '../../../architecture/util/constants';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private authService: AuthService,
    private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const data = localStorage.getItem(Constants.TOKEN_TRADEX);
    if (data) {
      return true;
    }
    localStorage.removeItem(Constants.TOKEN_TRADEX);
    localStorage.removeItem(Constants.CURRENT_USER_TRADEX);
    localStorage.removeItem(Constants.USER_DETAIL_TRADEX);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
    return false;
  }
}
