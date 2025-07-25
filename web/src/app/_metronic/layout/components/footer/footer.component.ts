import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',

})
export class FooterComponent {
  @Input() appFooterContainerCSSClass: string = '';

  currentDateStr: string = new Date().getFullYear().toString();
  constructor() {}
}
