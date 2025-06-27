import {
  Component,
  OnInit,
} from "@angular/core";
import { BaseComponent } from "../../../architecture/component/base/base.component";
import { AlertSwalService } from "../../../architecture/services/alert-swal/alert-swal.service";

@Component({
  selector: "app-audit-show-config",
  templateUrl: "./audit-show-config.component.html",
  styleUrls: ["./audit-show-config.component.scss"],
})
export class AuditShowConfigComponent extends BaseComponent implements OnInit {
  nameModal = "auditShowConfigModal";
  rangevalue = 10;
  auditConfig = {
    rangevalue: null,
  };
  constructor(
    protected alertSwal: AlertSwalService,
  ) {
    super();
  }

  ngOnInit(): void {}

  open() {
    this.showModal(this.nameModal);
  }

  valueChanged(e) {
    this.rangevalue = e.target.value;
  }

  saveConfig(){
    this.auditConfig.rangevalue = this.rangevalue;
    this.hideModal(this.nameModal);
    this.alertSwal.successToast("Configuração salva com sucesso!");
  }
}
