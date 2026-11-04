import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode } from '@angular/core';
import { DxRangeSelectorModule } from 'devextreme-angular';

import { Service, MonthPeriod } from './app.service';

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
  dataSource: MonthPeriod[];

  constructor(service: Service) {
    this.dataSource = service.getPeriods();
  }
}

bootstrapApplication(AppComponent);
