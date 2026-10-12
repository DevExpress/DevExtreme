import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DataSource, ArrayStore } from 'devextreme-angular/common/data';
import { DxSelectBoxModule } from 'devextreme-angular';
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
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  fromUngroupedData: DataSource;

  fromPregroupedData: DataSource;

  constructor(service: Service) {
    this.fromUngroupedData = new DataSource({
      store: new ArrayStore({
        data: service.getUngroupedData(),
        key: 'ID',
      }),
      group: 'Category',
    });

    this.fromPregroupedData = new DataSource({
      store: new ArrayStore({
        data: service.getPregroupedData(),
        key: 'ID',
      }),
      map(item) {
        item.key = item.Category;
        item.items = item.Products;
        return item;
      },
    });

    this.fromPregroupedData.load();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
