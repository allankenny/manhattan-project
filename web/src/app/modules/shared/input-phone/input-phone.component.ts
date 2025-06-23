import {Component, Input} from '@angular/core';
import { Subject } from 'rxjs';
import {InputTextComponent} from '../input-text/input-text.component';

/**
  Component reutilizável de caixa de texto de telefone.
*/
@Component({
  selector: 'app-input-phone',
  templateUrl: './input-phone.component.html',
  styleUrls: ['./input-phone.component.scss']
})
export class InputPhoneComponent extends InputTextComponent {

  constructor() {
    super();
  }

}
