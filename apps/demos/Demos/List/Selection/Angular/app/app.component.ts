import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { DataSource, ArrayStore } from 'devextreme-angular/common/data';
import { DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { SingleMultipleAllOrNone } from 'devextreme-angular/common';
import { DxListModule, DxListTypes } from 'devextreme-angular/ui/list';
import { Service } from './app.service';

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
    BrowserModule,
    DxSelectBoxModule,
    DxListModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  tasks: DataSource;

  selectAllModeValue: DxListTypes.SelectAllMode = 'page';

  selectionModeValue: SingleMultipleAllOrNone = 'all';

  selectByClick = false;

  constructor(service: Service) {
    this.tasks = new DataSource({
      store: new ArrayStore({
        key: 'id',
        data: service.getTasks(),
      }),
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
