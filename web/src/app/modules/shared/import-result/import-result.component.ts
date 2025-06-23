import { Component, Output, EventEmitter } from '@angular/core';
import { SheetManager } from 'src/app/model/sheet-manager';
import { AlertSwalService } from 'src/app/architecture/services/alert-swal/alert-swal.service';

@Component({
  selector: 'app-import-result',
  templateUrl: './import-result.component.html',
  styleUrls: ['./import-result.component.scss']
})
export class ImportResultComponent {
  @Output() importSuccess = new EventEmitter<any>();
  @Output() importError = new EventEmitter<any>();

  constructor(private alertSwal: AlertSwalService) {}

  errorImportList: any[];
  successImportList: any[];
  headerErrorDetail: any[];
  resultTitle: string = 'erros encontrados';
  importDone: boolean = false;
  showResults: boolean = true;

  public prepareImportObject(file: File, model_target: string): SheetManager {
    const object = new SheetManager();
    object.model_target = model_target;
    object.file = file;
    return object;
  }

  public resetImportLists(): void {
    this.errorImportList = undefined;
    this.successImportList = undefined;
    this.headerErrorDetail = undefined;
  }

  public handleImportSuccess(resp: any): void {
    this.successImportList = resp;
    this.importDone = true;
    this.importSuccess.emit(resp);
    this.resultTitle = 'importados com sucesso';
    this.alertSwal.success('Planilha importada com sucesso.');

  }

  public handleImportError(error: any): void {
    let processedError = this.processError(error);
    this.importError.emit(processedError);
    this.alertSwal.error('Erro ao importar planilha.');
  }

  private processError(error: any): any {
    if (!Array.isArray(error.error.message)) {
      this.headerErrorDetail = error.error.message.required_columns;
      return { error: { text: 'Erro ao importar planilha', detail: error.error.message.error } };
    } else {
      this.errorImportList = this.constructErrorList(error.error.message);
      return { error: { text: 'Erro ao importar planilha', detail: 'Verifique os erros abaixo' } };
    }
  }

  private constructErrorList(messages: any[]): any[] {
    return messages.reduce((acc, msg) =>
      acc.concat(
        Object.keys(msg.errors).map(key => ({
          key: key.toUpperCase(),
          line_number: msg.item.line_number,
          message: msg.errors[key].message
        }))
      ), []);
  }

  public hideErrorList(): void {
    this.showResults = !this.showResults;
  }
}
