import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../architecture/component/base/base.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertSwalService } from '../../../architecture/services/alert-swal/alert-swal.service';
import { ErrorHandlerService } from '../../../architecture/services/error-handler/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { PageInfo } from '../../../architecture/model/page-info';
import { User } from '../../../model/user';
import { Location } from '@angular/common';
import { UserPasswordEditComponent } from '../user-password-edit/user-password-edit.component';
import { debounceInput } from 'src/app/architecture/util/debounce-input';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent extends BaseComponent implements OnInit {

  @ViewChild(UserPasswordEditComponent) private userPasswordEditComponent: UserPasswordEditComponent;

  id: string = null;
  lengthCharacter = false;
  lowercaseCharacter = false;
  upercaseCharacter = false;
  numberCharacter = false;
  notWhitespaceCharacter = true;

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
    this.loadObject();
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      avatar: [null],
      email: [null, [Validators.required, Validators.email]],
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      username: [null, Validators.required],
      password: [null],
      cpf: [null],
      phone: [null],
      is_active: [true],
      is_promoter: [false],
      is_supervisor: [false],
      is_merchandising_head: [false],
      is_merchandising_coordinator: [false]
    });
  }

  save() {
    if (this.form.invalid) {
      this.forceValidateAllFormFields(this.form);
      return;
    }
    // if (!this.id){
    //   if (!this.lengthCharacter || !this.lowercaseCharacter || !this.upercaseCharacter || !this.numberCharacter) {
    //     this.alertSwal.error('A senha informada não é aceita por todas as condições.');
    //     return;
    //   }
    // }

    const object = this.createObject();
    if (!this.id) {
      this.service.createFormData(object).subscribe(
        {
          next: (resp) => {
            this.alertSwal.success('Usuário incluído com sucesso.');
            this.router.navigate(['user']);
          },
          error: (erro) => {
            this.errorHandlerService.handle(erro);
          }
        }
      );
    } else {
      object.id = this.id;
      this.service.update(object).subscribe(
        {
          next: (resp) => {
            this.alertSwal.success('Usuário atualizado com sucesso.')
            this.router.navigate(['user']);
          },
          error: (erro) => {
            this.errorHandlerService.handle(erro);
          }
        }
      );
    }
  }

  loadObject(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.service.read(this.id).subscribe(
        {
          next: (resp) => {
            this.populateObject(resp);
          },
          error: (erro) => {
            this.errorHandlerService.handle(erro);
          }
        }
      );
    }
  }

  populateObject(item: User) {
    this.setValue(this.form, 'id', item.id);
    this.setValue(this.form, 'avatar', item.avatar);
    this.setValue(this.form, 'email', item.email);
    this.setValue(this.form, 'first_name', item.first_name);
    this.setValue(this.form, 'last_name', item.last_name);
    this.setValue(this.form, 'username', item.username);
    this.setValue(this.form, 'cpf', item.cpf);
    this.setValue(this.form, 'phone', item.phone);
    this.setValue(this.form, 'is_active', item.is_active);

  }

  createObject() {
    const object = new User();
    object.id = this.getValueForm(this.form, 'id');
    object.avatar = this.getValueForm(this.form, 'avatar');
    object.email = this.getValueForm(this.form, 'email');
    object.first_name = this.getValueForm(this.form, 'first_name');
    object.last_name = this.getValueForm(this.form, 'last_name');
    object.username = this.getValueForm(this.form, 'username');
    object.cpf = this.getValueForm(this.form, 'cpf');
    object.phone = this.getValueForm(this.form, 'phone');
    object.password = this.getValueForm(this.form, 'password');
    object.is_active = this.getValueForm(this.form, 'is_active');
    return object;
  }

  cancel() {
    // this.location.back();
    this.router.navigate(['user']);
  }

  removeFile() {
    this.setValue(this.form, 'avatar', null);
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.setValue(this.form, 'avatar', file);
    }
  }

  getAvatarUrl() {
    const avatar = this.getValueForm(this.form, 'avatar');
    if (avatar) {
      return avatar;
    } else {
      return '../../../../assets/media/avatars/blank.png';
    }
  }

  hasImage() {
    return this.getValueForm(this.form, 'avatar');
  }

  updatePassword() {
    this.userPasswordEditComponent.open(this.id);
  }

}
