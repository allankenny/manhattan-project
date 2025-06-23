import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { BaseInput } from '../../../architecture/component/base-input/base-input.component';
import { AlertSwalService } from '../../../architecture/services/alert-swal/alert-swal.service';
import { environment } from '../../../../environments/environment';
import { FileUtil } from '../../../architecture/util/file-util';

/**
  Component reutilizável de caixa de texto para documentos CPF.
*/
@Component({
  selector: 'app-file-input-image',
  templateUrl: './file-input-image.component.html',
  styleUrls: ['./file-input-image.component.scss']
})
export class FileInputComponent extends BaseInput implements OnInit {

  /** Tamanho máximo permitido para o arquivo, em Megabytes. */
  @Input() maxFileSize = 0;

  /** Emissor de Evento para quando o arquivo for trocado. */
  @Output() change: EventEmitter<any> = new EventEmitter();

  protected showInvalidFileFormatError = false;
  protected showInvalidFileSizeError = false;

  /** Tamanho constatado do arquivo carregado. */
  protected fileSize = 0;

  constructor(
    protected alertSwalService: AlertSwalService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  isShowInvalidFileFormatError(): boolean {
    return this.showInvalidFileFormatError;
  }

  isShowInvalidFileSizeError(): boolean {
    return this.showInvalidFileSizeError;
  }

  getFileSize(): number {
    return this.fileSize;
  }

  onChange(event) {

    this.fileSize = 0;
    this.showInvalidFileSizeError = false;
    this.showInvalidFileFormatError = false;

    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.fileSize = file.size;

      if (this.isFileNotEmpty(file)) {

        let invalidFile = false;

        if (this.isFileFormatInvalid(file)) {
          //  Arquivo em formato inválido
          this.showInvalidFileFormatError = true;
          invalidFile = true;
        }
        if (this.isFileSizeAboveLimit(file)) {
          //  Arquivo com tamanho acima do limite
          this.showInvalidFileSizeError = true;
          invalidFile = true;
        }

        if (invalidFile) {
          //  Rejeita o arquivo inválido
          this.setValue(null);

          if (this.showInvalidFileFormatError) {
            this.alertSwalService.warn('Arquivos com extensões ".exe", ".msg", ".rar" e ".zip"  não são permitidos.'
            );
          }

          if (this.showInvalidFileSizeError) {

            let fileSizeLimit: number = this.maxFileSize * (1024 * 1024);
            if (fileSizeLimit === 0 || fileSizeLimit > environment.fileMaxSize) {
              fileSizeLimit = environment.fileMaxSize;
            }

            const displayFileSizeLimit: number = Math.ceil(fileSizeLimit / (1024));

            this.alertSwalService.warn('O tamanho do arquivo excede o limite de ' + displayFileSizeLimit + ' Megabytes.');
          }

        } else {
          //  Aceita o arquivo
          this.passFileDataToUploadFile(file);
        }
      }
    }

    if (this.change) {
      this.change.emit();
    }
  }

  protected passFileDataToUploadFile(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      //const uploadFile = new UploadFile(file.type, (reader.result as string).split(',')[1], file.name);
      //this.setValue(uploadFile);
    };
  }

  hasFile(): boolean {
    return true;
    // const file: UploadFile = this.getValue();

    // return (file !== undefined && file !== null)
    //   && (file.contentType !== undefined && file.contentType !== null);
  }

  protected isFileNotEmpty(file: File): boolean {
    return (file !== undefined && file !== null)
      && (file.type !== undefined && file.type !== null);
  }

  protected isFileFormatInvalid(file: File): boolean {
    if (this.isFileNotEmpty(file) && file.name) {
      return !FileUtil.isExtensionImagePermitted(file.name);
    }

    return false;
  }

  protected isFileSizeAboveLimit(file: File): boolean {
    if (file.size > environment.fileMaxSize) {
      //  Limite acima do permitdo pela aplicação.
      return true;
    }

    if (!this.maxFileSize || this.maxFileSize === 0) {
      return false;
    }
    return file.size > (this.maxFileSize * (1024 * 1024));
  }

  getValue(): string {
    return super.getValue() as string;
  }

  setValue(file: string): void {
    if (this.form) {
      super.setValue(file);
    }
  }

  protected getContent(): string {
    const file: string = this.getValue();
    if (file) {
      return file.content;
    }

    return null;
  }

  protected getContentType(): string {
    const file: UploadFile = this.getValue();
    if (file) {
      return file.contentType;
    }

    return null;
  }

  protected getName(): string {
    const file: UploadFile = this.getValue();
    if (file) {
      return file.name;
    }

    return '';
  }

  protected getNameToDisplay(): string {
    const fileName = this.getName();
    if (!fileName) {
      return '(Arquivo Sem Nome)';
    }
    if (fileName.length > 100) {
      return fileName.substring(0, 100) + '...';
    }

    return fileName;
  }

  protected getFileSizeInBytes(): number {
    return this.fileSize;
  }

  protected getFileSizeInMegabytes(): number {
    return this.getFileSizeInBytes() / (1024 * 1024);
  }

  protected geFileSizeInMegabytesRounded(): number {
    return Math.ceil(this.getFileSizeInMegabytes() * 10) / 10;
  }

  getMaxFileSizeInMegabytes(): number {
    if (!this.maxFileSize || this.maxFileSize * (1024) > environment.fileMaxSize) {
      return environment.fileMaxSize / (1024);
    }

    return this.maxFileSize;
  }

  isArquivoRejeitado(): boolean {
    return this.showInvalidFileFormatError || this.showInvalidFileSizeError;
  }

  getAccessibleLabel(): string {
    return super.getAccessibleLabel()
      + '. Seletor de Arquivo'
      + (this.hasFile()
        ? '. Arquivo selecionado: \"' + this.getNameToDisplay() + '\"'
        : '. Nenhum arquivo selecionado'
      );
  }

}
