import { Component, Input, ElementRef, OnChanges } from '@angular/core';
import { StringUtil } from '../../../architecture/util/string-util';

@Component({
    selector: 'read-more',
    templateUrl: './read-more.component.html',
    styleUrls: ['./read-more.component.scss']
})

export class ReadMoreComponent implements OnChanges {

    /** Conteúdo a ser exibido. */
    @Input() text: string;
    /** Tamanho máximo para a exibição colapsada. */
    @Input() maxLength: number = 100;

    /** Tamanho para resumo descritivo para acessibilidade no botão. */
    static readonly summaryMaxLength: number = 25;

    currentText: string;
    hideToggle: boolean = true;

    public isCollapsedReadMore: boolean = true;

    constructor(private elementRef: ElementRef) {
    }

    toggleView(): void {
        this.isCollapsedReadMore = !this.isCollapsedReadMore;
        this.determineView();
    }

    determineView(): void {
        if (!this.text || this.text.trim().length <= this.maxLength) {
            this.currentText = (this.text
                ? StringUtil.avoidUnbreakableLongWordsForHtml( this.text )
                : '');
            //this.isCollapsedReadMore = false;
            this.hideToggle = true;
            return;
        }
        this.hideToggle = false;
        if (this.isCollapsedReadMore == true) {
            this.currentText = (StringUtil.avoidUnbreakableLongWordsForHtml( this.text ).substring(0, this.maxLength) + '…');
        } else if (this.isCollapsedReadMore == false) {
            this.currentText = StringUtil.avoidUnbreakableLongWordsForHtml( StringUtil.convertLineBreaksToHtmlTags( this.text ) );
        }

    }

    ngOnChanges(): void {
        this.determineView();
    }

    /** Gera um resumo para o botão de 'Leia mais' para fins de acessibilidade.
     * @returns Resumo do texto
     */
    getSummaryForButton(): string {
        if (!this.text) {
            return this.text;
        }
        const summary: string = StringUtil.convertLineBreaksToWhiteSpaces(this.text);
        const summaryMaxLength: number = this.maxLength < ReadMoreComponent.summaryMaxLength ? this.maxLength : ReadMoreComponent.summaryMaxLength;
        if (summary.length < summaryMaxLength) {
            return summary;
        }
        return summary.substring(0, summaryMaxLength) + '…';
    }

}