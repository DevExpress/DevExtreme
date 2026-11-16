import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { DatePipe } from '@angular/common';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxDataGridModule,
  ],
})
export class AppComponent {
  readonly orders = inject(Service).getOrders();

  customizeDate(itemInfo) {
    return `First: ${new DatePipe('en-US').transform(itemInfo.value, 'MMM dd, yyyy')}`;
  }
}

bootstrapApplication(AppComponent);
