import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxListModule,
  DxButtonModule,
  DxTagBoxModule,
  DxFilterBuilderModule,
} from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const anyOfOperation = {
  name: 'anyof',
  caption: 'Is any of',
  icon: 'check',
  editorTemplate: 'tagBoxTemplate',
  calculateFilterExpression(filterValue: any, field: any) {
    return filterValue && filterValue.length
                && Array.prototype.concat.apply([], filterValue.map((value) => [[field.dataField, '=', value], 'or'])).slice(0, -1);
  },
};

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  filterText: any;

  dataSourceText: any;

  fields: Array<any>;

  customOperations: Array<any>;

  filter: any;

  categories: string[];

  groupOperations: string[] = ['and', 'or'];

  constructor(service: Service) {
    this.fields = service.getFields();
    this.filter = service.getFilter();
    this.categories = service.getCategories();
    this.customOperations = [anyOfOperation];
  }

  updateTexts(e) {
    this.filterText = AppComponent.formatValue(e.component.option('value'));
    this.dataSourceText = AppComponent.formatValue(e.component.getFilterExpression());
  }

  private static formatValue(value, spaces = 0) {
    if (value && Array.isArray(value[0])) {
      const TAB_SIZE = 4;
      spaces = spaces || TAB_SIZE;
      return `[${AppComponent.getLineBreak(spaces)}${value.map((item) => (Array.isArray(item[0]) ? AppComponent.formatValue(item, spaces + TAB_SIZE) : JSON.stringify(item))).join(`,${AppComponent.getLineBreak(spaces)}`)}${AppComponent.getLineBreak(spaces - TAB_SIZE)}]`;
    }
    return JSON.stringify(value);
  }

  private static getLineBreak(spaces) {
    return `\r\n${new Array(spaces + 1).join(' ')}`;
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
