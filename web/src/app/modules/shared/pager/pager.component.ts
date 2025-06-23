import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { PageInfo } from '../../../architecture/model/page-info';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {

  @Input() pageInfo: PageInfo;
  @Output() pageChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onPageChange() {
    if (this.pageChange) {
      this.pageChange.emit();
    }
  }
}
