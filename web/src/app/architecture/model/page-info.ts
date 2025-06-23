import { environment } from "../../../environments/environment";
import { StoredPaginationUtil } from "../util/stored-pagination-util";

export class PageInfo {

  /** Acual page. */
  public actualPage: number;

  /** Total pages. */
  public pages: number;

  /** Total itens. */
  public count: number;

  public pageSize: number;
  public pageSizeCards: number;

  /** Next page URL*/
  public next: string;

  /** Previous page. */
  public previous: string;

  public ordering: string;

  constructor() {
    this.actualPage = 1;
    this.pages = 0;
    this.count = 0;
    this.pageSize = environment.pageSize;
    this.pageSizeCards = environment.pageSizeCards;
  }

  merge(resp: any): void {
    this.pages = Math.ceil(resp.count / this.pageSize);
    if(!resp.previous) {
      this.actualPage = 1;
    } else if (!resp.next) {
        this.actualPage = this.pages;
    } else {
      const parameters = StoredPaginationUtil.getParametersUrl(resp.next);
      const parameterPage = parameters.filter(item => item.includes("page="));
      if(parameterPage && parameterPage.length > 1) {
        this.actualPage = +parameterPage[0].split('=')[1];
        this.actualPage = this.actualPage - 1;
      }
    }
    this.count = resp.count;
    this.keepPageSizeUnderStandard();
  }

  reset(): void {
    this.actualPage = 1;
    this.pages = 1;
    this.count = 0;
    this.keepPageSizeUnderStandard();
  }

  setPageSize(newPageSize: number): void {
    if (this.pageSize !== newPageSize) {
      this.reset();
    }
    this.pageSize = newPageSize;
    this.keepPageSizeUnderStandard();
  }

  private keepPageSizeUnderStandard(): void {
    if (!this.pageSize || this.pageSize < 1) {
      this.pageSize = environment.pageSize;
    }
  }


}
