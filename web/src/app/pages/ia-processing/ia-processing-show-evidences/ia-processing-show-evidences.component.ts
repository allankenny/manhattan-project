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
  selector: "app-ia-processing-show-evidences",
  templateUrl: "./ia-processing-show-evidences.component.html",
  styleUrls: ["./ia-processing-show-evidences.component.scss"],
})
export class IAProcessingShowEvidencesComponent
  extends BaseComponent
  implements OnInit
{
  nameModal = "iaProcessingShowEvidencesModal";
  imgUrl = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    protected alertSwal: AlertSwalService,
    private errorHandlerService: ErrorHandlerService,
    private location: Location
  ) {
    super();
  }

  ngOnInit(): void {}

  open(img: string = null) {
    this.imgUrl = img;
		console.log("Image URL:", this.imgUrl);
    if (!this.imgUrl) {
      this.alertSwal.error("Nenhuma imagem selecionada");
      return;
    }
    this.showModal(this.nameModal);
  }
}
