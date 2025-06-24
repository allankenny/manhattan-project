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
import { ExecutionsService } from 'src/app/services/executions.service';

@Component({
  selector: 'app-ia-processing',
  templateUrl: './ia-processing.component.html',
  styleUrls: ['./ia-processing.component.scss']
})
export class IAprocessingComponent implements OnInit {

  executionList: any[] = [];

  form: FormGroup;
  loading: boolean = false;
  loadingList: boolean = false;

  constructor(private service: ExecutionsService,
    private router: Router,
    protected messageNotificationService: MessageNotificationService,
    protected alertSwal: AlertSwalService,
    protected formBuilder: FormBuilder,
    private errorHandlerService: ErrorHandlerService) {
    this.createForm();
  }

  ngOnInit() {
    this.getListExecutionsProcessed()
  }

  getListExecutionsProcessed(): void {
    this.loadingList = true;
    this.service.getList().subscribe(
      {
        next: (resp) => {
          this.executionList = resp;
          this.loadingList = false;
        },
        error: (erro) => {
          this.loadingList = false;
          this.errorHandlerService.handle(erro);
        }
      }
    );
  }

  protected createForm(): void {
    this.form = this.formBuilder.group({
      execution: [''],
    });
  }

  processIAexecution(): void {
    const executionId = this.form.get('execution').value;
    if (!executionId) {
      this.alertSwal.error("Selecione uma execução para processar.");
      return;
    }
    this.loading = true;
    this.service.processExecution(executionId).subscribe({
      next: (resp) => {
        this.alertSwal.success("Processamento iniciado com sucesso.");
        this.loading = false;
        this.getListExecutionsProcessed();
      },
      error: (error) => {
        this.errorHandlerService.handle(error);
        this.loading = false;
      }
    });
  }

  showDetails(item: any): void {
    console.log(item);
    this.router.navigate(['ia-processing/analytic', item._id]);
  }


}
