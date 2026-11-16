import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DataSource, ArrayStore } from 'devextreme-angular/common/data';
import { DxTagBoxModule } from 'devextreme-angular';
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
    DxTagBoxModule,
  ],
})
export class AppComponent {
  readonly simpleProducts = new DataSource({
    store: new ArrayStore({
      data: inject(Service).getProducts(),
      key: 'id',
    }),
    group: 'Category',
  });
}

bootstrapApplication(AppComponent);
