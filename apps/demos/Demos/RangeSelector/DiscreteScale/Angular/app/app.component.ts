import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DxRangeSelectorModule, DxRangeSelectorTypes } from 'devextreme-angular/ui/range-selector';
import { Service, ProductionData } from './app.service';

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
  imports: [
    DxRangeSelectorModule,
    DecimalPipe,
  ],
})
export class AppComponent {
  dataSource: ProductionData[];

  totalResult = 12809000;

  constructor(service: Service) {
    this.dataSource = service.getData();
  }

  onValueChanged(e: DxRangeSelectorTypes.ValueChangedEvent) {
    const data = this.dataSource;
    let total = 0;
    let startIndex;
    let endIndex;

    data.forEach((item, index) => {
      if (item.country === e.value[0]) {
        startIndex = index;
      } else if (item.country === e.value[1]) {
        endIndex = index;
      }
    });

    if (endIndex) {
      data
        .slice(startIndex, endIndex + 1)
        .forEach((item) => {
          total += item.copper;
        });
    } else {
      total = data[startIndex].copper;
    }

    this.totalResult = total;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
