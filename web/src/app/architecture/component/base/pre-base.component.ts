import {Router} from '@angular/router';
import { StoredPaginationUtil } from '../../util/stored-pagination-util';
import { Constants } from '../../util/constants';

/** Base da aplicação para quando o usuário ainda não tiver se autentificado no sistema. */
export abstract class PreBaseComponent {

  /** Realiza a ação de deslogar o usuário do sistema.
   * @param router para redirecionar para a tela de login.
   */
  signOut(router: Router): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto'
    });

    localStorage.removeItem(Constants.CURRENT_USER_TRADEX);
    localStorage.removeItem(Constants.USER_DETAIL_TRADEX);
    localStorage.removeItem(Constants.TOKEN_TRADEX);
    StoredPaginationUtil.clearStoredPagination();

    router.navigate(['/auth/login']);
  }

  getCurrentUser() {//:CurrentUser {
    const userStr = localStorage.getItem(Constants.CURRENT_USER_TRADEX);
    if (userStr !== undefined && userStr !== null) {
      return JSON.parse(userStr);
    }
    return null;
  }

  /** Informa se o usuário está logado no momento.
   * @returns Usuário logado Sim/Não
   */
  isUserLogged(): boolean {
    return this.getCurrentUser() !== null;
  }

  getUserDetails(){//: UserDetails {
    const userDetails = localStorage.getItem(Constants.USER_DETAIL_TRADEX);
    if (userDetails) {
      return JSON.parse(userDetails);
    }

    return null;
  }

  navigateToHome(router: Router) {
    router.navigate(['']);
  }

  /** Obtém o endereço atual da página. */
  getCurrentAddress(): string {
    return window.location.href;
  }

}
