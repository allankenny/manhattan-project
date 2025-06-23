import {AbstractControl} from '@angular/forms';
import {Component, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {Subject} from 'rxjs';
import { BaseInput } from '../../../architecture/component/base-input/base-input.component';
import { Model } from '../../../model/model';

/**
  Component reutilizável de pesquisa por texto, incluindo funcionalidades como
  histórico de resultados, e navegação na paginação dos resultados.
*/
@Component({
  selector: 'app-input-select-filter',
  templateUrl: './input-select-filter.component.html',
  styleUrls: ['./input-select-filter.component.scss']
})
export class InputSelectFilterComponent extends BaseInput {

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

  /** Função para que a pesquisa seja realizada nos atributos necessários */
  @Input() customSearchFn: Function;
  /**
    Conversor que constroe o nome do item selecionado que será posto na caixa
    de texto.
    Na ausência deste conversor, será utilizado o labelConverter.
  */
  @Input() nameBuilderConverter: Function;

  private defaultConverter = (option: any): string => option;

  /** Resultados da consulta. */
  @Input() results: any[];

  /** Texto para exibir quando não há resultados encontrados. */
  @Input() notFoundText: string;

  @Input() bindLabel: string;

  @Output() inputCleared: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();

  constructor(
    protected renderer: Renderer2
  ) {
    super();
    this.notFoundText = 'Nenhum registro encontrado';
  }

  protected buildName(obj: any): string {
    if (this.nameBuilderConverter) {
      return this.nameBuilderConverter(obj);
    }
    return this.getItemLabel(obj);
  }

  protected clear(): void {
    this.form.get(this.identifier).setValue(null);
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
      this.form.get(this.identifier).setValue(item);
    } else {
      this.clear();
    }

    if (this.selected) {
      this.selected.emit();
    }
  }
   
}
