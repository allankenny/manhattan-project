import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TranslationService} from './modules/i18n';
// language list
import {locale as enLang} from './modules/i18n/vocabs/en';
import {locale as chLang} from './modules/i18n/vocabs/ch';
import {locale as esLang} from './modules/i18n/vocabs/es';
import {locale as jpLang} from './modules/i18n/vocabs/jp';
import {locale as deLang} from './modules/i18n/vocabs/de';
import {locale as frLang} from './modules/i18n/vocabs/fr';
import {ThemeModeService} from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements OnInit {
  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  ngOnInit() {
    this.modeService.init();
    $('a[class="dropdown-toggle"]').click(function(){
      var pos = $(this).closest('td').position();
      var ele = $(this).siblings('ul.dropdown-menu');
       var width = $(document).width() - 200;

      if( width > pos.left) {
        $(ele).css({
          left: pos.left,
          top: (pos.top + 20)
      });
      } else {
         $(ele).css({
          left: (pos.left - 180),
          top: (pos.top + 20)
         });
      }
    });
  }
}
