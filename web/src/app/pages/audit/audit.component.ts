import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageNotificationService } from "src/app/architecture/services/message-notification/message-notification.service";
import { PagedListPageComponent } from "src/app/architecture/component/paged-list-page/paged-list-page.component";
import { AlertSwalService } from "../../architecture/services/alert-swal/alert-swal.service";
import { ErrorHandlerService } from "../../architecture/services/error-handler/error-handler.service";
import { ExecutionsService } from "src/app/services/executions.service";
import { categories, industries } from 'src/assets/mock.js';
import { AuditShowConfigComponent } from "./audit-show-config/audit-show-config.component";
import { range } from "rxjs";
interface auditConfig{
  industry: null | string;
  category: null | string;
  start_date: null | Date;
  end_date: null | Date;
  rangevalue: null | number;
  execution_name: null | string;
  period: null | string;
  audit_type: null | string;
}
@Component({
  selector: "app-audit",
  templateUrl: "./audit.component.html",
  styleUrls: ["./audit.component.scss"],
})
export class AuditComponent implements OnInit {

  @ViewChild(AuditShowConfigComponent) private auditShowConfigComponent: AuditShowConfigComponent;

  executionList: any[] = [];
  rangevalue = 10;
  industries: any[] = []
  industry_category: any[] = [];
  categories: any[] = [];
  form: FormGroup;
  loading: boolean = false;
  loadingList: boolean = false;
  loadingRange: boolean = false;

  auditType: any = [
    { value: "execution_name", name: "Nome da execução" },
    { value: "filter", name: "Filtro de execução" },
    { value: "recurrence", name: "Auditoria recorrente" },
  ];

  recorrencePeriod: any = [
    { value: "daily", name: "Diário" },
    { value: "weekly", name: "Semanal" },
    { value: "monthly", name: "Mensal" },
    { value: "yearly", name: "Anual" },
  ];

  auditTypeSelected: string = "";

  totalExecutions: number = 0;
  totalExecutionsAudited: number = 0;

  filtred: boolean = false;

  auditConfig: auditConfig = {
    industry: null,
    category: null,
    start_date: null,
    end_date: null,
    execution_name: null,
    period: null,
    audit_type: null,
    rangevalue: 10,
  };

  industrySelected: string = null;

  constructor(
    private service: ExecutionsService,
    private router: Router,
    protected messageNotificationService: MessageNotificationService,
    protected alertSwal: AlertSwalService,
    protected formBuilder: FormBuilder,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getListExecutionsProcessed();
    this.categories = categories;
    this.industries = industries;
  }

  onIndustryChange(): void {
    this.industrySelected = this.form.get("industry").value;
    this.industry_category = this.categories.filter(
      (category) => category.industry_id === this.industrySelected
    );
  }
  valueChanged(e) {
    this.rangevalue = e.target.value;
    this.executionsAudited()
  }

  onTypeChange(){
    this.auditTypeSelected = this.form.get("audit_type").value;
  }

  executionsAudited() {
    this.totalExecutionsAudited =  Math.round(this.totalExecutions * (this.rangevalue / 100)); 
  }

  getRandomNumber(min: number = 100, max: number = 2000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  filterExecutions(){
    if (!this.form.valid) {
      this.alertSwal.error("Preencha todos os campos obrigatórios.");
      return;
    }
    this.loadingRange = true;
    setTimeout(() => {
      this.filtred = true;
      this.loadingRange = false;
      this.totalExecutions = this.getRandomNumber();
      this.executionsAudited()
    }, 4000);

  }

  getListExecutionsProcessed(): void {
    this.loadingList = true;
    this.service.getList().subscribe({
      next: (resp) => {
        this.executionList = resp;
        this.loadingList = false;
      },
      error: (erro) => {
        this.loadingList = false;
        this.errorHandlerService.handle(erro);
      },
    });
  }

  protected createForm(): void {
    this.form = this.formBuilder.group({
      audit_type: [null, Validators.required],
      industry: [null],
      category: [null],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      execution_name: [null],
      period: [null],
      range_value: [10, Validators.required],
      range_recorrence: [10, Validators.required],
    });
  }

  processIAexecution(): void {
    const executionId = this.form.get("execution").value;
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
      },
    });
  }

  showDetails(item: any): void {
    console.log(item);
    this.router.navigate(["audit/analytic", item._id]);
  }

  showGlobalAuditConfig(){
    console.log("Abrindo configuração global de auditoria");
    this.auditShowConfigComponent.open();
  }

}
