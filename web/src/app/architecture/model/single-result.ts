import { Message } from "../services/message-notification/message";

export class SingleResult<T> {

  public message: Message;
  public data: T;

  constructor() {
    this.message = null;
    this.data = null;
  }
}
