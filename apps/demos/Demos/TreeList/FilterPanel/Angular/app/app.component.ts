import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import DataSource from 'devextreme/data/data_source';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  dataSource: DataSource;

  filterValue: DxTreeListTypes.Properties['filterValue'] = ['City', '=', 'Bentonville'];

  constructor(service: Service) {
    this.dataSource = new DataSource({
      store: service.getEmployees(),
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTreeListModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
