import { BaseModel } from "./base-model";
import { User } from "./user";

export class UserStatus extends BaseModel {

  user: User;
  status: string;
  last_login: Date;
  last_seen: Date;

  constructor() {
    super();
    this.user = null;
    this.status = null;
    this.last_login = null;
    this.last_seen = null;
  }

}