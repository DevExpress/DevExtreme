import { bootstrapApplication } from '@angular/platform-browser';
import {
  enableProdMode, ChangeDetectionStrategy, Component, inject, signal, viewChild,
} from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CustomStore } from 'devextreme-angular/common/data';
import { DxDataGridModule } from 'devextreme-angular';
import type { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { DxTreeViewModule, DxTreeViewComponent, type DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';
import { DxDropDownBoxModule } from 'devextreme-angular/ui/drop-down-box';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DxTreeViewModule,
    DxDropDownBoxModule,
    DxDataGridModule,
  ],
})
export class AppComponent {
  private readonly treeView = viewChild(DxTreeViewComponent);

  private readonly httpClient = inject(HttpClient);

  readonly treeDataSource = this.makeAsyncDataSource('treeProducts.json');

  readonly gridDataSource = this.makeAsyncDataSource('customers.json');

  readonly isTreeBoxOpened = signal(false);

  readonly isGridBoxOpened = signal(false);

  readonly gridBoxValue = signal([3]);

  readonly treeBoxValue = signal<string | string[]>('1_1');

  readonly gridColumns = ['CompanyName', 'City', 'Phone'];

  private makeAsyncDataSource(jsonFile: string) {
    const http = this.httpClient;

    return new CustomStore({
      loadMode: 'raw',
      key: 'ID',
      load() {
        return lastValueFrom(http.get(`../../../../data/${jsonFile}`));
      },
    });
  }

  syncTreeViewSelection() {
    const treeView = this.treeView();

    if (!treeView) return;

    const treeBoxValue = this.treeBoxValue();

    if (treeBoxValue) {
      treeView.instance.selectItem(treeBoxValue);
    } else {
      treeView.instance.unselectAll();
    }

    this.isTreeBoxOpened.set(false);
  }

  treeView_itemSelectionChanged(e: DxTreeViewTypes.ItemSelectionChangedEvent) {
    const selectedKeys = e.component.getSelectedNodeKeys();
    this.treeBoxValue.set(selectedKeys.length > 0 ? selectedKeys[0] : null);
  }

  dataGrid_selectionChanged(e: DxDataGridTypes.SelectionChangedEvent) {
    this.gridBoxValue.set(e.selectedRowKeys);
    this.isGridBoxOpened.set(false);
  }

  readonly gridBox_displayExpr = ({ CompanyName, Phone }) => CompanyName && `${CompanyName} <${Phone}>`;
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
  ],
});
