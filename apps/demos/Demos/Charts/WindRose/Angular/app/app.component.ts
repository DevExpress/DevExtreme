import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxPolarChartModule, DxPolarChartTypes } from 'devextreme-angular/ui/polar-chart';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxPolarChartModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly windRoseData = this.service.getWindRoseData();

  readonly windSources = this.service.getWindSources();

  onLegendClick({ target: series }: DxPolarChartTypes.LegendClickEvent) {
    series.isVisible()
      ? series.hide()
      : series.show();
  }
}

bootstrapApplication(AppComponent);
