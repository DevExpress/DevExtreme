import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
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

const TAB_SIZE = 4;

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxListModule,
    DxButtonModule,
    DxTagBoxModule,
    DxFilterBuilderModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  readonly filterText = signal('');

  readonly dataSourceText = signal('');

  readonly fields: string[] = this.service.getFields();

  readonly filter = signal<(string[] | string)[]>(this.service.getFilter());

  readonly categories = this.service.getCategories();

  readonly customOperations: typeof anyOfOperation[] = [anyOfOperation];

  readonly groupOperations = ['and', 'or'];

  updateTexts(e: DxFilterBuilderTypes.InitializedEvent) {
    this.filterText.set(AppComponent.formatValue(e.component.option('value')));
    this.dataSourceText.set(AppComponent.formatValue(e.component.getFilterExpression()));
  }

  private static formatValue(value: FilterBuilderValue, spaces = TAB_SIZE) {
    if (value && Array.isArray(value[0])) {
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

bootstrapApplication(AppComponent);
