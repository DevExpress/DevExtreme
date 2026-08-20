import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxDataGridModule,
  DxButtonModule,
  DxFilterBuilderModule,
} from 'devextreme-angular';

import { Service } from './app.service';
import type { Fields, Columns, Condition, Product } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxDataGridModule,
    DxButtonModule,
    DxFilterBuilderModule,
  ],
})

export class AppComponent {
  dataSource: Product[];

  fields: Fields;

  columns: Columns;

  filter: Condition;

  gridFilterValue: Condition;

  constructor(service: Service) {
    this.fields = service.getFields();
    this.columns = service.getColumns();
    this.filter = service.getFilter();
    this.gridFilterValue = this.filter;
    this.dataSource = service.getProducts();
  }

  buttonClick() {
    this.gridFilterValue = this.filter;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
