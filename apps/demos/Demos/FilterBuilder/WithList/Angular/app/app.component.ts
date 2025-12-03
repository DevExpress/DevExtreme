import { bootstrapApplication } from '@angular/platform-browser';
import { Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  DxListModule,
  DxButtonModule,
  DxTagBoxModule,
  DxFilterBuilderComponent,
  DxFilterBuilderModule,
} from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';
import { Fields, Filter, Service } from './app.service';

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
    DxListModule,
    DxButtonModule,
    DxTagBoxModule,
    DxFilterBuilderModule,
    CurrencyPipe,
  ],
})

export class AppComponent {
  @ViewChild(DxFilterBuilderComponent, { static: false }) filterBuilder: DxFilterBuilderComponent;

  dataSource: DataSource;

  fields: Fields;

  filter: Filter;

  constructor(service: Service) {
    this.fields = service.getFields();
    this.filter = service.getFilter();
    this.dataSource = new DataSource({
      store: service.getProducts(),
    });
  }

  refreshDataSource() {
    this.dataSource.filter(this.filterBuilder.instance.getFilterExpression());
    this.dataSource.load();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
