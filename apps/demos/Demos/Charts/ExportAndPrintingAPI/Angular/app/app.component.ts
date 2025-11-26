import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import { DxChartComponent, DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service, Mountain } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  preserveWhitespaces: true,
  imports: [
    DxChartModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;

  mountains: Mountain[];

  constructor(service: Service) {
    this.mountains = service.getMountains();
  }

  customizeTooltip = ({ argumentText, valueText, point: { data: { system } } }) => (
    {
      text: `<span class='title'>${argumentText}</span><br />&nbsp;<br />System: ${
        system}<br />Height: ${valueText} m`,
    }
  );

  customizeLabel: DxChartTypes.ValueAxisLabel['customizeText'] = ({ value }) => `${value} m`;

  print() {
    this.chart.instance.print();
  }

  export() {
    this.chart.instance.exportTo('Example', 'png');
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
