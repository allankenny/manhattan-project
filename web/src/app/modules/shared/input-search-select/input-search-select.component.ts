import {AbstractControl} from '@angular/forms';
import {Component, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {Subject} from 'rxjs';
import { BaseInput } from '../../../architecture/component/base-input/base-input.component';

/**
  Component reutilizável de pesquisa por texto, incluindo funcionalidades como
  histórico de resultados, e navegação na paginação dos resultados.
*/
@Component({
  selector: 'app-input-search-select',
  templateUrl: './input-search-select.component.html',
  styleUrls: ['./input-search-select.component.scss']
})
export class InputSearchSelectComponent extends BaseInput {

  /** Form control para o objeto do item selecionado. */
  @Input() objectIdentifier: string;

  /**
    Conversor de exibição para o nome do item.
    Este conversor é obrigatório.
  */
  @Input() labelConverter: Function;

  /**
    Conversor de exibição para a descrição do item.
    Isto é importante para o usuário poder diferenciar itens com o mesmo nome.
  */
  @Input() descriptionConverter: Function;

  /** Conversor de exibição para o sútil 'title' do item. */
  @Input() titleConverter: Function;

  /**
    Conversor que constroe o nome do item selecionado que será posto na caixa
    de texto.
    Na ausência deste conversor, será utilizado o labelConverter.
  */
  @Input() nameBuilderConverter: Function;

  private defaultConverter = (option: any): string => option;

  /** Resultados da consulta. */
  @Input() results: any[];

  /** Indicador do carregamento dos resultados. */
  @Input() isLoading: boolean;

  /** Consulta a ser chamada quando houver mudança no texto digitado. */
  @Input() queryOnChange: Subject<string>;

  /** Quantidade mínima de caracteres para a realização de consultas. */
  @Input() minTermLength: number;

  /** Texto para exibir quando não há resultados encontrados. */
  @Input() notFoundText: string;

  /** Texto para exibir na caixa de texto quando não houver item selecionado. */
  @Input() typeToSearchText: string;

  @Output() inputCleared: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();

  constructor(
    protected renderer: Renderer2
  ) {
    super();
    this.minTermLength = 3;
    this.notFoundText = 'Nenhum registro encontrado';
    this.typeToSearchText = 'Digite para pesquisar';
  }

  protected buildName(obj: any): string {
    if (this.nameBuilderConverter) {
      return this.nameBuilderConverter(obj);
    }
    return this.getItemLabel(obj);
  }

  protected clear(): void {
    this.form.get(this.objectIdentifier).setValue(null);
    this.setValue(null);
  }

  //  Override
  getAccessibleLabel(): string {
    return super.getAccessibleLabel()
    + ' - Caixa de seleção por pesquisa - ' +
    (
      this.getValue() !== null && this.getValue() !== undefined ?
      this.getValue()
      : 'Nenhum item selecionado'
    );
  }

  getItemLabel(obj: any): string {
    if (this.labelConverter) {
      return this.labelConverter(obj);
    }

    return this.defaultConverter(obj);
  }

  getItemDescription(obj: any): string {
    if (this.descriptionConverter) {
      return this.descriptionConverter(obj);
    }

    return '';
  }

  getItemTitle(obj: any): string {
    if (this.titleConverter) {
      return this.titleConverter(obj);
    }

    return '';
  }

  /**
    Hooker para quando o usuário limpa a caixa de texto e desseleciona o item.
  */
  onClear(): void {
    this.clear();
    if (this.inputCleared) {
      this.inputCleared.emit();
    }
  }

  /** Hooker para quando item for selecionado. */
  onSelect(item: any): void {
    if (item) {
      this.form.get(this.objectIdentifier).setValue(item);
      this.setValue(this.buildName(item));
    } else {
      this.clear();
    }

    if (this.selected) {
      this.selected.emit();
    }
  }

  // @Override
  fieldIsInvalid(): boolean {
    return super.fieldIsInvalid() ||
    (this.objectIdentifier && !this.form.get(this.objectIdentifier).valid && this.form.get(this.objectIdentifier).touched) as boolean;
  }


  // @Override
  isRequired(): boolean {
    return super.isRequired() ||
    (this.objectIdentifier && this.form.get(this.objectIdentifier) && this.form.get(this.objectIdentifier).validator && this.form.get(this.objectIdentifier).validator({} as AbstractControl) && this.form.get(this.objectIdentifier).validator({} as AbstractControl).required) as boolean;
  }

}
