import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTileViewModule, DxButtonModule, DxListModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';

import { Service, Hotel } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})
export class AppComponent {
  dataSource: DataSource;

  currentHotel: Hotel;

  listSelectionChanged = (e) => {
    this.currentHotel = e.addedItems[0];
  };

  constructor(service: Service) {
    this.dataSource = service.getDataSource();
    this.currentHotel = service.getFirstHotel();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTileViewModule,
    DxButtonModule,
    DxListModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
