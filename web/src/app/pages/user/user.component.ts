import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageNotificationService } from 'src/app/architecture/services/message-notification/message-notification.service';
import { PagedListPageComponent } from 'src/app/architecture/component/paged-list-page/paged-list-page.component';
import { AlertSwalService } from '../../architecture/services/alert-swal/alert-swal.service';
import { ErrorHandlerService } from '../../architecture/services/error-handler/error-handler.service';
import { User } from '../../model/user';
import { FilterUser } from '../../model/filter/user.filter';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends PagedListPageComponent<User, FilterUser> implements OnInit {


  constructor(private service: UserService,
    private router: Router,
    protected messageNotificationService: MessageNotificationService,
    protected alertSwal: AlertSwalService,
    protected formBuilder: FormBuilder,
    private errorHandlerService: ErrorHandlerService) {
    super(formBuilder, messageNotificationService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  loadContent(filter): void {
    this.service.pagedFilterList(this.pageInfo, filter).subscribe(
      {
        next: (resp) => {
          this.processResponseToContent(resp, filter);
        },
        error: (erro) => {
          this.errorHandlerService.handle(erro);
        }
      }
    );
  }

  protected createForm(): void {
    this.form = this.formBuilder.group({
      name: [null],
      cpf: [null],
      username: [null],
      email: [null],
      is_active: [null],
    });
  }

  protected buildFilterFromForm(): FilterUser {
    const filtro: FilterUser = new FilterUser();
    filtro.name = this.form.get('name').value;
    filtro.cpf = this.form.get('cpf').value;
    filtro.username = this.form.get('username').value;
    filtro.email = this.form.get('email').value;
    filtro.is_active = this.form.get('is_active').value;
    return filtro;
  }


  edit(item: User) {
    this.router.navigate(['user/edit', item.id]);
  }

  upload(){
  }

  confirmRemove(item: User) {
    this.alertSwal.confirm(
      `Você tem certeza?`,
      `Deseja excluir o user: ${item.first_name} ${item.last_name}?`
    ).then(
      accept => {
        if (accept.value) {
          this.remove(item);
        }
      }
    );
  }

  remove(item: User) {
    this.service.remove(item.id).subscribe(
      {
        next: (resp) => {
          this.query();
          this.alertSwal.success('Usuário removido com sucesso');
        },
        error: (erro) => {
          this.errorHandlerService.handle(erro);
        }
    });
  }

  new() {
    this.router.navigate(['user/new']);
  }

}
