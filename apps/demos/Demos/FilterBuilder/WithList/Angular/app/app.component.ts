import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxListModule,
  DxButtonModule,
  DxTagBoxModule,
  DxFilterBuilderComponent,
  DxFilterBuilderModule,
} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { Fields, Filter, Service } from './app.service';

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
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})

export class AppComponent {
  @ViewChild(DxFilterBuilderComponent, { static: false }) filterBuilder: DxFilterBuilderComponent;

  dataSource: DataSource;

  fields: Fields;

  filter: Filter;

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
