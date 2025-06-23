import { Message } from '../services/message-notification/message';
import {PageInfo} from './page-info';

export class QueryResult<T> {

  public message: Message;
  public page: PageInfo;
  public results: T[];


  constructor() {
    this.message = null;
    this.page = null;
    this.results = [];
  }
}
