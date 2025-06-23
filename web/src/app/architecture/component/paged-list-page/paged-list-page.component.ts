import { BaseListPageComponent } from 'src/app/architecture/component/base-list-page/base-list-page.component';
import { FormBuilder } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageNotificationService } from '../../../architecture/services/message-notification/message-notification.service';
import { StoredPaginationUtil } from '../../../architecture/util/stored-pagination-util';
import { Subject } from 'rxjs';
import { PageInfo } from '../../model/page-info';
import { StoredPagination } from '../../model/stored-pagination';
import { debounceInput } from '../../util/debounce-input';
import { QueryResult } from '../../model/query-result';
import { ObjectUtil } from '../../util/object-util';
import { StringUtil } from '../../util/string-util';

@Component({
  template: ''
})
export abstract class PagedListPageComponent<T, F> extends BaseListPageComponent<T> implements OnInit, OnDestroy {

  /** Permite especificar a quantidade de registros por página. */
  @Input()
  public pageSize: number;

  /** Opção para ativar/desativar armazenamento e recuperação de paginação e filtro. (Ativado por padrão) */
  @Input()
  public storePagination: boolean = true;

  /** Informa se consulta deve ser realizada na inicialização. */
  @Input()
  public queryOnStart: boolean = true;

  /** Campos de formulário referentes à campos no filtro (pode deixar em branco se não for usar). */
  protected filterFields: string[];

  /** Informa se deve requisitar o preenchimento de pelo menos um campo de filtro especificado em `filterFields`. */
  @Input()
  public requireAnyFilterFieldForQuery: boolean = false;
  /** Informa se deve requisitar o preenchimento de todos os campos de filtro especificados em `filterFields`. */
  @Input()
  public requireAllFilterFieldsForQuery: boolean = false;

  /** Chamador de consulta que mantém intervalo entre consultas. */
  protected contentLoader: Subject<F> = new Subject<F>();

  /** Filtro da última consulta requisitada. */
  protected lastFilter: F;
  /** Informações de paginação. */
  public pageInfo: PageInfo = new PageInfo();

  /** Marca se este é o primeiro carregamento da página. */
  private firstPageLoad: boolean = true;
  /** Quantidade consultas requisitadas. */
  protected queriesRequested: number = 0;
  /** Quantidade de consultas executadas. */
  protected queriesExecuted: number = 0;
  /** Quantidade de consultas concluídas. */
  protected queriesCompleted: number = 0;

  constructor(
    protected formBuilder: FormBuilder,
    protected messageNotificationService: MessageNotificationService,
  ) {
    super();
    this.createForm();

    if (this.storePagination === true) {
      const recoveredPagination: StoredPagination = StoredPaginationUtil.recoverPagination();
      if (recoveredPagination) {
        if (recoveredPagination.getFormValues()) {
          for (let formValue of recoveredPagination.getFormValues()) {
            if (this.form?.controls[formValue.name]) {
              this.form?.controls[formValue.name].setValue(formValue.value);
            }
          }
        }
        if (recoveredPagination.getPageInfo()) {
          this.pageInfo.merge(recoveredPagination.getPageInfo());
        }
        this.lastFilter = this.buildFilterFromForm();
      }
    }

    this.contentLoader
      .pipe(debounceInput) // Intervalo
      .subscribe(filter => this.loadContent(filter));
  }

  ngOnInit(): void {
    if (this.queryOnStart) {
      this.query();
    }
  }

  ngOnDestroy(): void {
    this.contentLoader.unsubscribe();
  }

  pageChange(): void {
    this.query();
  }

  public confirmQuery(): void {
    if (this.isAnyFilterFieldRequiredButNoneFilled()) {
      if (this.queriesCompleted === 0) {
        this.showMessageFillAnyFilterFields();
      }
      this.content = null;
      return;
    }
    if (this.isAllFilterFieldsRequiredAndNotFilled()) {
      if (this.queriesCompleted === 0) {
        this.showMessageFillAllFilterFields();
      }
      this.content = null;
      return;
    }
    this.query();
  }

  public query(): void {
    this.queriesRequested++;

    if (this.form?.invalid) {
      if (!(this.queryOnStart && this.queriesRequested <= 1)) {
        this.messageNotificationService.notifyWarn(
          'Campos obrigatórios',
          'Preencha os campos do formulário para consultar'
        );
      }
      return;
    }

    if (this.pageSize) {
      this.pageInfo.setPageSize(this.pageSize);
    }

    if (this.isAnyFilterFieldRequiredButNoneFilled()) {
      if (this.queriesCompleted === 0) {
        this.showMessageFillAnyFilterFields();
      }
      this.content = null;
      return;
    }
    if (this.isAllFilterFieldsRequiredAndNotFilled()) {
      if (this.queriesCompleted === 0) {
        this.showMessageFillAllFilterFields();
      }
      this.content = null;
      return;
    }

    const filter: F = this.buildFilterFromForm();
    if (!this.isFilterEqualsToLastFilter(filter)) {
      this.pageInfo.reset();
    }

    this.contentLoader.next(filter);
    this.firstPageLoad = false;
    this.queriesExecuted++;
  }

  /** Compare an filter with the last filter. */
  protected isFilterEqualsToLastFilter(filter: F): boolean {
    return (filter && this.lastFilter)
      && JSON.stringify(filter) === JSON.stringify(this.lastFilter);
  }

  /** Query for the content with the informations on filter and pageInfo. */
  protected abstract loadContent(filter: F): void;

  protected processResponseToContent(resp: QueryResult<T>, filter: F): void {
    this.lastFilter = filter;
    if (resp) {
      this.content = resp.results;
      this.pageInfo.merge(resp);
      if (this.content.length === 0) {
        this.showMessageEmptyContent();
      }
    }
    if (this.storePagination === true) {
      StoredPaginationUtil.storePagination(this.pageInfo, this.form);
    }
    this.queriesCompleted++;
  }

  protected showMessageEmptyContent(): void {
    this.messageNotificationService.notifyInfo('Nenhuma informação encontrada', 'Não foram encontrados dados para a consulta');
  }

  /** Creates a form with fields for the filter. */
  protected abstract createForm(): void;

  /** Resets the form. */
  protected clearForm(): void {
    this.createForm();
  }

  /** Creates a filter from the form. */
  protected abstract buildFilterFromForm(): F;

  /** Clear the form's fields. */
  public clearFilter(): void {
    this.clearForm();
    this.pageInfo.reset();
    if (this.requireAllFilterFieldsForQuery || this.requireAnyFilterFieldForQuery) {
      StoredPaginationUtil.clearStoredPagination();
      this.content = null;
    } else {
      this.query();
    }
  }

  /** Informa se a página ainda está carregando, considerando se ainda não concluiu a primeira consulta.
   * @returns A página ainda está sendo carregada Sim/Não
   */
  public isFirstPageLoad(): boolean {
    return this.firstPageLoad === true;
  }

  /** Informa se pelo menos um campo de filtro especificado em `filterFields` foi preenchido no formulário.
   * @returns Algum campo de filtro preenchido Sim/Não
   */
  isAnyFilterFieldFilled(): boolean {
    const filterFields: string[] = this.filterFields ? this.filterFields : Object.keys(this.form.controls);
    if (filterFields) {
      for (const formControName of filterFields) {
        if (this.form?.controls[formControName]) {
          if ((!ObjectUtil.isNull(this.form.controls[formControName].value) && !StringUtil.isBlank(this.form.controls[formControName].value + ''))
            && !this.form?.controls[formControName].invalid
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /** Informa se todos os campos de filtro especificados em `filterFields` foram preenchidos no formulário.
   * @returns Todos os campos de filtro preenchidos Sim/Não
   */
  isAllFilterFieldsFilled(): boolean {
    const filterFields: string[] = this.filterFields ? this.filterFields : Object.keys(this.form.controls);
    if (filterFields) {
      for (const formControName of filterFields) {
        if (this.form?.controls[formControName]) {
          if ((!ObjectUtil.isNull(this.form.controls[formControName].value) && !StringUtil.isBlank(this.form.controls[formControName].value + ''))
            || this.form?.controls[formControName].invalid) {
            return false;
          }
        }
      }
    }
    return true;
  }

  isAnyFilterFieldRequiredButNoneFilled(): boolean {
    return this.requireAnyFilterFieldForQuery && !this.isAnyFilterFieldFilled();
  }

  /** Exibe uma mensagem que pede ao usuário preencher pelo menos um campo de filtro especificado em `filterFields`.
   */
  protected showMessageFillAnyFilterFields(): void {
    this.messageNotificationService.notifyWarn(
      'Filtro Obrigatório',
      'Preencha ao menos um campo no filtro para a realização da consulta.'
    );
  }

  isAllFilterFieldsRequiredAndNotFilled(): boolean {
    return this.requireAllFilterFieldsForQuery && !this.isAllFilterFieldsFilled();
  }

  /** Exibe uma mensagem que pede ao usuário preencher todos os campos de filtro especificados em `filterFields`.
   */
  protected showMessageFillAllFilterFields(): void {
    this.messageNotificationService.notifyWarn(
      'Campos de Filtro são Obrigatórios',
      'Preencha todos os campos do filtro para a realização da consulta.'
    );
  }

}
