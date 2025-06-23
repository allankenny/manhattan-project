import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../architecture/component/base/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertSwalService } from '../../../architecture/services/alert-swal/alert-swal.service';
import { ErrorHandlerService } from '../../../architecture/services/error-handler/error-handler.service';
import { CpfValidator } from '../../../modules/shared/validator/cpf-validator';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-password-edit',
  templateUrl: './user-password-edit.component.html',
  styleUrls: ['./user-password-edit.component.scss'],
})
export class UserPasswordEditComponent extends BaseComponent implements OnInit {

  nameModal = 'userPasswordEditModal';
  @Output() onSave: EventEmitter<User> = new EventEmitter<User>();

  id: string = null;
  lengthCharacter = false;
  lowercaseCharacter = false;
  upercaseCharacter = false;
  numberCharacter = false;
  notWhitespaceCharacter = true;
  fieldTextType: boolean;
  userData: User;

  constructor(private formBuilder: FormBuilder,
    private service: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    protected alertSwal: AlertSwalService,
    private errorHandlerService: ErrorHandlerService,
    private location: Location
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {
    this.form.get('password').valueChanges.subscribe(password => {
      if (password) {
        this.lengthCharacter = password.length >= 6;
        this.numberCharacter = password.match('[0-9]');
        this.notWhitespaceCharacter = !password.match('\\s');
      }
    });
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      password: ['', [
        Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),]
      ],
    });
  }

  save() {
    if (this.form.invalid) {
      this.forceValidateAllFormFields(this.form);
      return;
    }
    const object = this.createObject();
    this.service.passwordUpdate(object).subscribe(
      {
        next: (resp) => {
          this.alertSwal.success('Senha atualizada com sucesso.')
          this.router.navigate(['user']);
        },
        error: (erro) => {
          this.errorHandlerService.handle(erro);
        }
      }
    );
  }

  loadObject(id: string): void {
    if (id) {
      this.service.read(id).subscribe(
        {
          next: (resp: User) => {
            this.userData = resp;
          },
          error: (erro) => {
            this.errorHandlerService.handle(erro);
          }
        }
      );
    }
  }

  createObject() {
    const object = new User();
    // object._id = this.id;
    object.avatar = this.userData.avatar;
    object.email = this.userData.email;
    object.first_name = this.userData.first_name;
    object.last_name = this.userData.last_name;
    object.username = this.userData.username;
    object.is_active = this.userData.is_active;
    object.password = this.getValueForm(this.form, 'password');
    return object;
  }

  cancel() {
    // this.location.back();
    this.router.navigate(['user']);
  }

  open(id: string = null) {
    this.createForm();
    this.id = id;
    if (id) {
      this.loadObject(id);
    }
    this.showModal(this.nameModal);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
