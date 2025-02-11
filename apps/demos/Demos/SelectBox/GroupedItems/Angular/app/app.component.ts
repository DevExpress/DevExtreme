import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { DxSelectBoxModule } from 'devextreme-angular';
import { Service } from './app.service';

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
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
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

@NgModule({
  imports: [
    BrowserModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
