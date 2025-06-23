import {Severity} from './severity.enum';

export class Message {

  constructor(
    public severity: Severity,
    public summary: string,
    public detail: string
  ) {
  }
}
