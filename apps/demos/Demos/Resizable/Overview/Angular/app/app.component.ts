import {
  NgModule, Component, enableProdMode, ViewEncapsulation,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
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

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  encapsulation: ViewEncapsulation.None,
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

@NgModule({
  imports: [
    BrowserModule,
    DxResizableModule,
    DxDataGridModule,
    DxCheckBoxModule,
    DxTagBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
