import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxChartModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly populationData = inject(Service).getPopulationData();

  readonly types: DxChartTypes.SeriesType[] = ['area', 'stackedarea', 'fullstackedarea'];
}

bootstrapApplication(AppComponent);
