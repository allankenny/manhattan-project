import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Message} from './message';
import {Severity} from './severity.enum';

@Injectable({
  providedIn: 'root'
})
export class MessageNotificationService {

  notificationChange: Subject<Message> = new Subject<Message>();

  constructor() {
  }

  notify(message: Message) {
    this.notificationChange.next(message);
  }

  notifySuccess(summary: string, detail?: string) {
    this.notify(new Message(Severity.SUCCESS, summary, (detail ? detail : '')));
  }

  notifyInfo(summary: string, detail?: string) {
    this.notify(new Message(Severity.INFO, summary, (detail ? detail : '')));
  }

  notifyError(summary: string, detail?: string) {
    this.notify(new Message(Severity.ERROR, summary, (detail ? detail : '')));
  }

  notifyWarn(summary: string, detail?: string) {
    this.notify(new Message(Severity.WARN, summary, (detail ? detail : '')));
  }
}
