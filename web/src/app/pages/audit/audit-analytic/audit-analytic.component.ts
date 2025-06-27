import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { BaseComponent } from "../../../architecture/component/base/base.component";
import { FormBuilder } from "@angular/forms";
import { AlertSwalService } from "../../../architecture/services/alert-swal/alert-swal.service";
import { ErrorHandlerService } from "../../../architecture/services/error-handler/error-handler.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { ExecutionsService } from "src/app/services/executions.service";
import type { EChartsOption, BarSeriesOption } from 'echarts';
import { AuditShowProductDetailsComponent } from "../audit-show-product-details/audit-show-product-details.component";

@Component({
  selector: "app-audit-analytic",
  templateUrl: "./audit-analytic.component.html",
  styleUrls: ["./audit-analytic.component.scss"],
})
export class AuditAnalyticComponent
  extends BaseComponent
  implements OnInit
{
  id: string = null;
  executionData: any;
  chartOption: EChartsOption;
  chartOptionProducts: EChartsOption;
  defaultValues: any = {};
  valorTeste = 0;

  isLightboxOpen = false;
  currentIndex = 0;

  loading: boolean = false;

  @ViewChild(AuditShowProductDetailsComponent) private auditShowProductDetailsComponent: AuditShowProductDetailsComponent;

  showContainerEvidence: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: ExecutionsService,
    private activatedRoute: ActivatedRoute,
    protected alertSwal: AlertSwalService,
    private errorHandlerService: ErrorHandlerService,
    private location: Location
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.id = this.activatedRoute.snapshot.params["id"];
    if (this.id) {
      this.service.getDataIaProcessing(this.id).subscribe({
        next: (resp) => {
          this.executionData = resp;
          console.log("Execution Data:", this.executionData);
          this.buildChart(resp.brands);
          this.buildChartProducts(resp.products);
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.errorHandlerService.handle(error);
        },
      });
    }
  }

  buildChart(apiData: any[]): void {
    const categories = apiData.map(item => item.brand.name);
    const seriesNames = ['faces_audited','faces_promoter', 'faces_ir', 'faces_manhattan'];

    const colors: Record<string, string> = {
      faces_audited: '#34CC9C',
      faces_promoter: '#5159AC',
      faces_ir: '#517EAE',
      faces_manhattan: '#23909E'
    };

    const labelOption: BarSeriesOption['label'] = {
      show: true,
      position: 'insideBottom',
      rotate: 0, 
      align: 'center', 
      verticalAlign: 'middle',
      distance: 15, 
      formatter: '{c}',
      fontSize: 12
    };

    const series: BarSeriesOption[] = seriesNames.map(seriesName => ({
      name: seriesName,
      type: 'bar',
      // stack: 'total',
      label: labelOption,
      emphasis: { focus: 'series' },
      itemStyle: { 
        color: colors[seriesName],
        borderRadius: [10, 10, 0, 0]
      },
      data: apiData.map(item => item[seriesName] ?? 0)
    }));

    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: seriesNames,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: categories
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: series
    } as EChartsOption;
  }

  buildChartProducts(apiData: any[]): void {
    const categories = apiData.map(item => item.product.name);
    const seriesNames = ['faces_audited','faces_promoter', 'faces_ir', 'faces_manhattan'];

    const colors: Record<string, string> = {
      faces_audited: '#34CC9C',
      faces_promoter: '#5159AC',
      faces_ir: '#517EAE',
      faces_manhattan: '#23909E'
    };

    const labelOption: BarSeriesOption['label'] = {
      show: true,
      position: 'insideBottom',
      rotate: 0, 
      align: 'center', 
      verticalAlign: 'middle',
      distance: 15, 
      formatter: '{c}',
      fontSize: 12
    };

    const series: BarSeriesOption[] = seriesNames.map(seriesName => ({
      name: seriesName,
      type: 'bar',
      stack: 'total',
      label: labelOption,
      emphasis: { focus: 'series' },
      itemStyle: { 
        color: colors[seriesName]
      },
      data: apiData.map(item => item[seriesName] ?? 0)
    }));

    this.chartOptionProducts = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: seriesNames,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: categories
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: series
    } as EChartsOption;
  }

  back(): void {
    this.location.back();
  }

  showEvidenceList():void {
    this.showContainerEvidence = !this.showContainerEvidence;
  }


  setFacesAudited(item: any) {
    console.log("Marca encontrada:", item.brand);
    console.log("Quantidade a ser salva:", item.faces_audited);
    this.loading = true;
    if (item.faces_audited === null || item.faces_audited === undefined) {
      this.alertSwal.error('Quantidade a ser salva não pode ser nula ou indefinida.');
      return;
    }
    const data = [
      {
        brand_id: item.brand._id,
        faces: item.faces_audited
      }
    ];
    this.service.setFacesAudit(this.id, data).subscribe(() => {
      this.alertSwal.success('Dados salvos com sucesso!');
    });
    this.loading = false;
  }

  setFacesAuditedProduct(item: any) {
    if (item.faces_audited === null || item.faces_audited === undefined || item.price_audited === null || item.price_audited === undefined) {
      this.alertSwal.error('Quantidade a ser salva não pode ser nula ou indefinida.');
      return;
    }
    const data = [
      {
        product_id: item.product._id,
        faces: item.faces_audited,
        price: item.price_audited
      }
    ];
    this.service.setFacesAudit(this.id, data).subscribe(() => {
      this.alertSwal.success('Quantidade salva com sucesso!')
    });
  }

  saveDataProduct(itam:any) {
    if (itam.faces_audited === null || itam.faces_audited === undefined || itam.price_audited === null || itam.price_audited === undefined) {
      this.alertSwal.error('Quantidade a ser salva não pode ser nula ou indefinida.');
      return;
    }
    const data = [
      {
        product_id: itam.product._id,
        faces: itam.faces_audited,
        price: itam.price_audited
      }
    ];
    this.service.setFacesAndPriceAudit(this.id, data).subscribe(() => {
      this.alertSwal.success('Dados salvos com sucesso!');
    });

  }

  showDetailsProduct(item: any): void {
    console.log("Item selecionado:", item);
    if (!item) {
      this.alertSwal.error('Nenhum produto selecionado.');
      return;
    }
    this.auditShowProductDetailsComponent.open(item);
  }

  openLightbox(index: number) {
    this.currentIndex = index;
    this.isLightboxOpen = true;
  }

  closeLightbox() {
    this.isLightboxOpen = false;
  }

  nextImage(event: Event) {
    event.stopPropagation();
    this.currentIndex = (this.currentIndex + 1) % this.executionData?.evidences.length;
  }

  prevImage(event: Event) {
    event.stopPropagation();
    this.currentIndex =
      (this.currentIndex - 1 + this.executionData?.evidences.length) % this.executionData?.evidences.length;
  }

}