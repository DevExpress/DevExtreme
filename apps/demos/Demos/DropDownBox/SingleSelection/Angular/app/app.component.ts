import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, provideZoneChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CustomStore } from 'devextreme-angular/common/data';
import { DxDataGridModule } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { DxTreeViewModule, DxTreeViewComponent, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { DxDropDownBoxModule } from 'devextreme-angular/ui/drop-down-box';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DxTreeViewModule,
    DxDropDownBoxModule,
    DxDataGridModule,
  ],
})
export class AppComponent {
  @ViewChild(DxTreeViewComponent, { static: false }) treeView: DxTreeViewComponent;

  treeDataSource: CustomStore;

  gridDataSource: CustomStore;

  isTreeBoxOpened = false;

  isGridBoxOpened = false;

  gridBoxValue = [3];

  treeBoxValue: string | string[] = '1_1';

  gridColumns = ['CompanyName', 'City', 'Phone'];

  constructor(private httpClient: HttpClient, private ref: ChangeDetectorRef) {
    this.treeDataSource = this.makeAsyncDataSource(this.httpClient, 'treeProducts.json');
    this.gridDataSource = this.makeAsyncDataSource(this.httpClient, 'customers.json');
  }

  makeAsyncDataSource(http: HttpClient, jsonFile: string) {
    return new CustomStore({
      loadMode: 'raw',
      key: 'ID',
      load() {
        return lastValueFrom(http.get(`../../../../data/${jsonFile}`));
      },
    });
  }

  syncTreeViewSelection() {
    if (!this.treeView) return;

    if (this.treeBoxValue) {
      this.treeView.instance.selectItem(this.treeBoxValue);
    } else {
      this.treeView.instance.unselectAll();
    }

    this.isTreeBoxOpened = false;
    this.ref.detectChanges();
  }

  treeView_itemSelectionChanged(e: DxTreeViewTypes.ItemSelectionChangedEvent) {
    const selectedKeys = e.component.getSelectedNodeKeys();
    this.treeBoxValue = selectedKeys.length > 0 ? selectedKeys[0] : null;
  }

  dataGrid_selectionChanged(e: DxDataGridTypes.SelectionChangedEvent) {
    this.gridBoxValue = e.selectedRowKeys;
    this.isGridBoxOpened = false;
    this.ref.detectChanges();
  }

  gridBox_displayExpr = ({ CompanyName, Phone }) => CompanyName && `${CompanyName} <${Phone}>`;
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideHttpClient(withFetch()),
  ],
});
