import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
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
  private readonly service = inject(Service);

  readonly fromUngroupedData = new DataSource({
    store: new ArrayStore({
      data: this.service.getUngroupedData(),
      key: 'ID',
    }),
    group: 'Category',
  });

  readonly fromPregroupedData = new DataSource({
    store: new ArrayStore({
      data: this.service.getPregroupedData(),
      key: 'ID',
    }),
    map(item) {
      item.key = item.Category;
      item.items = item.Products;
      return item;
    },
  });

  constructor() {
    this.fromPregroupedData.load();
  }
}

bootstrapApplication(AppComponent);
