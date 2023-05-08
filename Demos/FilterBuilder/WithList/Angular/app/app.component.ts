import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxListModule,
  DxButtonModule,
  DxTagBoxModule,
  DxFilterBuilderComponent,
  DxFilterBuilderModule,
} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
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
  @ViewChild(DxFilterBuilderComponent, { static: false }) filterBuilder: DxFilterBuilderComponent;

  dataSource: any;

  fields: Array<any>;

  filter: any;

  constructor(service: Service) {
    this.fields = service.getFields();
    this.filter = service.getFilter();
    this.dataSource = new DataSource({
      store: service.getProducts(),
    });
  }

  refreshDataSource() {
    this.dataSource.filter(this.filterBuilder.instance.getFilterExpression());
    this.dataSource.load();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxListModule,
    DxButtonModule,
    DxTagBoxModule,
    DxFilterBuilderModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
