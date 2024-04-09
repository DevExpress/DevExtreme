import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { Service, Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  providers: [Service],
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  dataSource: Employee[];

  readonly allowedPageSizes = [5, 10, 'all'];

  readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];

  displayMode = 'full';

  showPageSizeSelector = true;

  showInfo = true;

  showNavButtons = true;

  customizeColumns(columns) {
    columns[0].width = 70;
  }

  get isCompactMode() {
    return this.displayMode === 'compact';
  }

  constructor(service: Service) {
    this.dataSource = service.generateData(100000);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule, DxCheckBoxModule, DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
