import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxRangeSelectorModule } from 'devextreme-angular';

import { Service, Data } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxRangeSelectorModule,
  ],
})
export class AppComponent {
  dataSource: Data[];

  constructor(service: Service) {
    this.dataSource = service.getData();
  }

  customizeSeries(valueFromNameField) {
    return valueFromNameField === 'USA' ? { color: 'red' } : {};
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
