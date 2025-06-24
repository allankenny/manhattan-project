import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { BaseComponent } from "../../../architecture/component/base/base.component";
import { FormBuilder, Validators } from "@angular/forms";
import { AlertSwalService } from "../../../architecture/services/alert-swal/alert-swal.service";
import { ErrorHandlerService } from "../../../architecture/services/error-handler/error-handler.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../../../services/user.service";
import { User } from "../../../model/user";
import { Location } from "@angular/common";

@Component({
  selector: "app-ia-processing-show-product-details",
  templateUrl: "./ia-processing-show-product-details.component.html",
  styleUrls: ["./ia-processing-show-product-details.component.scss"],
})
export class IAProcessingShowProductDetailsComponent
  extends BaseComponent
  implements OnInit
{
  nameModal = "iaProcessingShowProductDetailsModal";
  product: any = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    protected alertSwal: AlertSwalService,
    private errorHandlerService: ErrorHandlerService,
    private location: Location
  ) {
    super();
  }

  ngOnInit(): void {}

  open(item: any = null) {
    this.product = item;
    if (!this.product) {
      this.alertSwal.error("Nenhum produto selecionado.");
      return;
    }
    this.showModal(this.nameModal);
  }
}
