import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import {
  DxChartModule, DxPieChartModule, DxChartComponent, DxPieChartComponent, DxButtonModule,
} from 'devextreme-angular';
import { exportWidgets } from 'devextreme/viz/export';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxChartModule,
    DxPieChartModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  private readonly chart = viewChild.required(DxChartComponent);

  private readonly pieChart = viewChild.required(DxPieChartComponent);

  private readonly service = inject(Service);

  readonly title = 'Total Olympic Medals\n in 2008';

  readonly allMedals = this.service.getAllMedals();

  readonly goldMedals = this.service.getGoldMedals();

  export() {
    const chartInstance = this.chart().instance;
    const pieChartInstance = this.pieChart().instance;

    exportWidgets([[chartInstance, pieChartInstance]], {
      fileName: 'chart',
      format: 'PNG',
    });
  }
}

bootstrapApplication(AppComponent);
