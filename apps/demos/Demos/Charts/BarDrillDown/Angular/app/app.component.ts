import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, DxButtonModule } from 'devextreme-angular';

import { Service, DataItem } from './app.service';

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
    DxButtonModule,
  ],
})

export class AppComponent {
  dataSource: DataItem[];

  colors: string[];

  service: Service;

  isFirstLevel: boolean;

  constructor(service: Service) {
    this.dataSource = service.filterData('');
    this.colors = service.getColors();
    this.service = service;
    this.isFirstLevel = true;
  }

  onButtonClick() {
    if (!this.isFirstLevel) {
      this.isFirstLevel = true;
      this.dataSource = this.service.filterData('');
    }
  }

  onPointClick(e) {
    if (this.isFirstLevel) {
      this.isFirstLevel = false;
      this.dataSource = this.service.filterData(e.target.originalArgument);
    }
  }

  customizePoint = () => ({
    color: this.colors[Number(this.isFirstLevel)],
    ...this.isFirstLevel ? {} : {
      hoverStyle: {
        hatching: 'none',
      },
    },
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
