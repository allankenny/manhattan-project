import {BaseComponent} from 'src/app/architecture/component/base/base.component';
import {Component, OnInit} from '@angular/core';

@Component({
  template: ''
})
export abstract class BaseListPageComponent<T> extends BaseComponent implements OnInit {

  public content: T[];

  constructor(
  ) {
    super();
  }

  ngOnInit() {
    this.query();
  }

  /** Query to get the content. */
  public abstract query(): void;

}
