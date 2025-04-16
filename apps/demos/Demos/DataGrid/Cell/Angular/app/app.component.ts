import {
  NgModule, Component, Pipe, PipeTransform, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxSparklineComponent,
  DxTemplateDirective,
} from 'devextreme-angular';
import {
  DxDataGridComponent,
    DxoDataGridSortingComponent,
    DxoDataGridPagerComponent,
    DxoDataGridPagingComponent,
    DxoDataGridColumnComponent,
} from 'devextreme-angular/ui/data-grid';
import {
  DxSparklineComponent,
  DxSparklineSizeComponent,
  DxoSparklineTooltipComponent,
} from 'devextreme-angular/ui/sparkline';

import { Service, WeekData } from './app.service';

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
  providers: [Service],
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

@Pipe({ name: 'gridCellData' })
export class GridCellDataPipe implements PipeTransform {
  transform({ data, column }) {
    return data[column.caption.toLowerCase()];
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridComponent,
    DxoDataGridSortingComponent,
    DxoDataGridPagerComponent,
    DxoDataGridPagingComponent,
    DxoDataGridColumnComponent,
    DxTemplateDirective,
    DxSparklineComponent,
    DxSparklineSizeComponent,
    DxoSparklineTooltipComponent,
  ],
  declarations: [AppComponent, GridCellDataPipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
