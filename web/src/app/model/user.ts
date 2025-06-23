import { BaseModel } from "./base-model";

export class User extends BaseModel {

    _id: string;
    first_name: string;
    last_name: string;
    username: string;
    cpf: string;
    phone: string;
    password: string;
    email: string;
    avatar: string;
    is_staff: boolean;
    is_sector: boolean;
    date_joined: Date;

    constructor() {
        super();
        this._id = null;
        this.first_name = null;
        this.last_name = null;
        this.username = null;
        this.cpf = null;
        this.phone = null;
        this.password = null;
        this.email = null;
        this.avatar = null;
    }

}
