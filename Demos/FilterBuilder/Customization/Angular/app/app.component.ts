import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxListModule, DxButtonModule, DxTagBoxModule } from 'devextreme-angular';
import { DxFilterBuilderModule, DxFilterBuilderComponent, DxFilterBuilderTypes } from 'devextreme-angular/ui/filter-builder';
import { Service } from './app.service';

type FilterBuilderValue = ReturnType<DxFilterBuilderComponent['instance']['getFilterExpression']>;

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const anyOfOperation = {
  name: 'anyof',
  caption: 'Is any of',
  icon: 'check',
  editorTemplate: 'tagBoxTemplate',
  calculateFilterExpression: (filterValue: string[], field: Record<string, unknown>) => filterValue?.flatMap(
    (value) => [[field.dataField, '=', value], 'or'],
  ).slice(0, -1),
} as const;

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  filterText: string;

  dataSourceText: string;

  fields: Array<string>;

  filter: Array<string[] | string>;

  categories: string[];

  customOperations: Array<typeof anyOfOperation> = [anyOfOperation];

  groupOperations = ['and', 'or'];

  constructor(service: Service) {
    this.fields = service.getFields();
    this.filter = service.getFilter();
    this.categories = service.getCategories();
  }

  updateTexts(e: DxFilterBuilderTypes.InitializedEvent) {
    this.filterText = AppComponent.formatValue(e.component.option('value'));
    this.dataSourceText = AppComponent.formatValue(e.component.getFilterExpression());
  }

  private static formatValue(value: FilterBuilderValue, spaces = 0) {
    if (value && Array.isArray(value[0])) {
      const TAB_SIZE = 4;

      spaces = spaces || TAB_SIZE;

      return `[${AppComponent.getLineBreak(spaces)}${
        (value as string[]).map(
          (item: FilterBuilderValue) => (Array.isArray(item[0])
            ? AppComponent.formatValue(item, spaces + TAB_SIZE)
            : JSON.stringify(item)),
        ).join(`,${AppComponent.getLineBreak(spaces)}`)
      }${AppComponent.getLineBreak(spaces - TAB_SIZE)}]`;
    }
    return JSON.stringify(value);
  }

  private static getLineBreak = (spaces: number) => `\r\n${new Array(spaces + 1).join(' ')}`;
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
