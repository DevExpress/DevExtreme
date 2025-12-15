import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, ViewEncapsulation, provideZoneChangeDetection } from '@angular/core';
import {
  DxResizableModule,
  DxDataGridModule,
  DxTagBoxModule,
  DxCheckBoxModule,
} from 'devextreme-angular';
import { Service, Order } from './app.service';

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
  encapsulation: ViewEncapsulation.None,
  imports: [
    DxResizableModule,
    DxDataGridModule,
    DxCheckBoxModule,
    DxTagBoxModule,
  ],
})
export class AppComponent {
  handleValues: string[] = ['left', 'top', 'right', 'bottom'];

  keepAspectRatio = true;

  handles: string[] = ['left', 'top', 'right', 'bottom'];

  orders: Order[];

  resizableClasses = '';

  constructor(service: Service) {
    this.orders = service.getOrders();
  }

  handlesValueChange({ value }) {
    this.resizableClasses = this.handleValues.reduce((acc, handle) => {
      const newClass = value.includes(handle) ? '' : ` no-${handle}-handle`;
      return acc + newClass;
    }, 'dx-resizable');
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
