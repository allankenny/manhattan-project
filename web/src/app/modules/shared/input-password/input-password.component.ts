import {Component, Input} from '@angular/core';
import {InputTextComponent} from '../input-text/input-text.component';

/**
  Component reutilizável de caixa de texto para senhas.
*/
@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss']
})
export class InputPasswordComponent extends InputTextComponent {

}
