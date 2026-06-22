import { bootstrapApplication } from '@angular/platform-browser';
import { Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxDataGridComponent, DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { DxNumberBoxModule, DxNumberBoxTypes } from 'devextreme-angular/ui/number-box';
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
  imports: [
    DxDataGridModule,
    DxNumberBoxModule,
  ],
})
export class AppComponent {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  searchValue = '';

  similarityFactor = 0.31;

  dataSource: AspNetData.CustomStore;

  constructor() {
    this.dataSource = AspNetData.createStore({
      key: 'ID',
      loadUrl: `${url}/Get`,
      loadParams: {
        searchValue: () => this.searchValue,
        similarityFactor: () => this.similarityFactor,
      },
      onBeforeSend: (method, ajaxOptions) => {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });
  }

  onSimilarityFactorChanged(e: DxNumberBoxTypes.ValueChangedEvent): void {
    this.similarityFactor = e.value;
    if (this.searchValue !== '') {
      this.dataGrid.instance.getDataSource().reload();
    }
  }

  onEditorPreparing(e: DxDataGridTypes.EditorPreparingEvent): void {
    if (e.parentType === 'searchPanel') {
      let searchTimeout: ReturnType<typeof setTimeout> | undefined;
      e.editorOptions.onValueChanged = (args: { value: string }) => {
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout(() => {
          this.searchValue = args.value;
          e.component.getDataSource().reload();
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
