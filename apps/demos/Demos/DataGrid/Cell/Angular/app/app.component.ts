import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, Pipe, PipeTransform, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxDataGridModule,
  DxSparklineModule,
} from 'devextreme-angular';
import { CurrencyPipe, DecimalPipe } from "@angular/common";
import { Service, WeekData } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Pipe({ name: 'gridCellData' })
export class GridCellDataPipe implements PipeTransform {
  transform({ data, column }) {
    return data[column.caption.toLowerCase()];
  }
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  imports: [
    DxDataGridModule,
    DxSparklineModule,
    GridCellDataPipe,
    CurrencyPipe,
     DecimalPipe,
  ],
})
export class AppComponent {
  dataSource: WeekData[];

  constructor(service: Service) {
    this.dataSource = service.getWeekData();
  }

  abs(value: number) {
    return Math.abs(value);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
