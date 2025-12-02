import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxRangeSelectorModule } from 'devextreme-angular';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';

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
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxRangeSelectorModule,
    DxChartModule,
  ],
})
export class AppComponent {
  dataSource: Record<string, unknown>[] = [];

  visualRange: DxChartTypes.ArgumentAxis['visualRange'] = {};

  constructor() {
    const max = 100;

    for (let i = 0; i < max; i += 1) {
      this.dataSource.push({
        arg: Math.pow(10, i * 0.1),
        val: Math.log(i + 1) / Math.log(0.5) + (Math.random() - 0.5) * (100 / (i + 1)) + 10,
      });
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
