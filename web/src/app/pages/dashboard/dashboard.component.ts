import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  view: any[];
  // width: number = 700;
  // height: number = 300;
  fitContainer: boolean = false;

  // view: any[] = [600, 400];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = '';
  timeline = true;
  doughnut = true;
  legendPosition: string = 'below';
  colorScheme = {
    domain: ['#206581', '#4496b8', '#44b0b8', '#44b8a9', '#44b884']
  };

  colorSchemeDark = {
    domain: ['#7375a5', '#21a3a3', '#13c8b5', '#6cf3d5', '#2b364a']
  };
  //pie
  showLabels = true;
  // data goes here
  public single = [
    {
      "name": "YTD23",
      "value": 224
    },
    {
      "name": "UM3",
      "value": 112
    }
  ];
  public singlePie = [
    {
      "name": "Executados",
      "value": 20,
      "label": "20%"
    },
    {
      "name": "Planejados",
      "value": 80,
      "label": "80%"
    },

  ];
  constructor() {}

}