import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxDataGridModule, type DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { DxNumberBoxModule, type DxNumberBoxTypes } from 'devextreme-angular/ui/number-box';
import DataSource from 'devextreme/data/data_source';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

const url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridSemanticSearch';

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxDataGridModule,
    DxNumberBoxModule,
  ],
})
export class AppComponent {
  searchValue = '';

  similarityFactor = 0.31;

  dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      store: AspNetData.createStore({
        key: 'ID',
        loadUrl: `${url}/Get`,
        loadParams: {
          searchValue: () => this.searchValue,
          similarityFactor: () => this.similarityFactor,
        },
        onBeforeSend: (method, ajaxOptions) => {
          ajaxOptions.xhrFields = { withCredentials: true };
        },
      })
    });
  }

  onSimilarityFactorChanged(e: DxNumberBoxTypes.ValueChangedEvent): void {
    this.similarityFactor = e.value;
    if (this.searchValue !== '') {
      this.dataSource.reload();
    }
  }

  onEditorPreparing(e: DxDataGridTypes.EditorPreparingEvent): void {
    if (e.parentType === 'searchPanel') {
      let searchTimeout: ReturnType<typeof setTimeout> | undefined;
      e.editorOptions.onValueChanged = (args: { value: string }) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.searchValue = args.value;
          this.dataSource.reload();
        }, e.updateValueTimeout);
      };
      e.editorOptions.placeholder = 'Try: clothing';
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
