import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, Pipe, PipeTransform, enableProdMode, inject,
} from '@angular/core';
import {
  DxDataGridModule,
  DxSparklineModule,
} from 'devextreme-angular';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Pipe({ name: 'gridCellData' })
export class GridCellDataPipe implements PipeTransform {
  transform({ data, column }) {
    return data[column.caption.toLowerCase()];
  }
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
  readonly dataSource = inject(Service).getWeekData();

  abs(value: number) {
    return Math.abs(value);
  }
}

bootstrapApplication(AppComponent);
