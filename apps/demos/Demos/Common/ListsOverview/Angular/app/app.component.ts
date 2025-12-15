import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DxTileViewModule, DxButtonModule, DxListModule } from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';

import { Service, Hotel } from './app.service';

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
    DxTileViewModule,
    DxButtonModule,
    DxListModule,
    CurrencyPipe,
  ],
})
export class AppComponent {
  dataSource: DataSource;

  currentHotel: Hotel;

  listSelectionChanged = (e) => {
    this.currentHotel = e.addedItems[0];
  };

  constructor(service: Service) {
    this.dataSource = service.getDataSource();
    this.currentHotel = service.getFirstHotel();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
