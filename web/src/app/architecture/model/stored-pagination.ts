import {AbstractControl} from '@angular/forms';
import {NamedValue} from './named-value';
import { PageInfo } from './page-info';

/** Armazenamento de páginação de consulta filtrada. */
export class StoredPagination {

  private address: string;
  private formValues: NamedValue[];
  private pageInfo: PageInfo;

  constructor(address: string, pageInfo: PageInfo, formValues: NamedValue[]) {
    this.address = address;
    this.pageInfo = pageInfo;
    this.formValues = formValues;
  }

  public getAddress(): string {
    return this.address;
  }

  public getFormValues(): NamedValue[] {
    return this.formValues;
  }

  public getPageInfo(): PageInfo {
    return this.pageInfo;
  }

  public static fromJSON(json: string): StoredPagination {
    const object: StoredPagination = JSON.parse(json);
    return new StoredPagination(object.address, object.pageInfo, object.formValues);
  }

}
