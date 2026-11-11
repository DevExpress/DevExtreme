import { bootstrapApplication } from '@angular/platform-browser';
import {
  enableProdMode, Component, inject, signal, viewChild,
} from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CustomStore } from 'devextreme-angular/common/data';
import { DxDropDownBoxModule, DxDataGridModule } from 'devextreme-angular';
import { DxTreeViewComponent, DxTreeViewModule, type DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxTreeViewModule,
    DxDropDownBoxModule,
    DxDataGridModule,
  ],
})
export class AppComponent {
  private readonly treeView = viewChild(DxTreeViewComponent);

  private readonly http = inject(HttpClient);

  readonly treeDataSource = this.makeAsyncDataSource('treeProducts.json');

  readonly gridDataSource = this.makeAsyncDataSource('customers.json');

  readonly treeBoxValue = signal<string[]>(['1_1']);

  readonly gridBoxValue = signal([3]);

  private makeAsyncDataSource(jsonFile: string) {
    const http = this.http;

    return new CustomStore({
      loadMode: 'raw',
      key: 'ID',
      load() {
        return lastValueFrom(http.get(`../../../../data/${jsonFile}`));
      },
    });
  }

  onDropDownBoxValueChanged() {
    this.updateSelection(this.treeView()?.instance);
  }

  onTreeViewReady(e: DxTreeViewTypes.ContentReadyEvent) {
    this.updateSelection(e.component);
  }

  private updateSelection(treeView: DxTreeViewComponent['instance']) {
    if (!treeView) return;

    const treeBoxValue = this.treeBoxValue();

    if (!treeBoxValue) {
      treeView.unselectAll();
    }

    treeBoxValue?.forEach(((value) => {
      treeView.selectItem(value);
    }));
  }

  onTreeViewSelectionChanged(e: DxTreeViewTypes.ItemSelectionChangedEvent) {
    this.treeBoxValue.set(e.component.getSelectedNodeKeys());
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
  ],
});
