import {
  enableProdMode, Component, ViewChild, NgModule,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import CustomStore from 'devextreme/data/custom_store';
import { DxDropDownBoxModule, DxDataGridModule } from 'devextreme-angular';
import { DxTreeViewComponent, DxTreeViewModule, DxTreeViewTypes } from 'devextreme-angular/ui/tree-view';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  @ViewChild(DxTreeViewComponent, { static: false }) treeView: DxTreeViewComponent;

  treeDataSource: any;

  gridDataSource: any;

  treeBoxValue = ['1_1'];

  gridBoxValue = [3];

  constructor(http: HttpClient) {
    this.treeDataSource = this.makeAsyncDataSource(http, 'treeProducts.json');
    this.gridDataSource = this.makeAsyncDataSource(http, 'customers.json');
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

  onDropDownBoxValueChanged() {
    this.updateSelection(this.treeView?.instance);
  }

  onTreeViewReady(e: DxTreeViewTypes.ContentReadyEvent) {
    this.updateSelection(e.component);
  }

  updateSelection(treeView: DxTreeViewComponent['instance']) {
    if (!treeView) return;

    if (!this.treeBoxValue) {
      treeView.unselectAll();
    }

    this.treeBoxValue?.forEach(((value) => {
      treeView.selectItem(value);
    }));
  }

  onTreeViewSelectionChanged(e: DxTreeViewTypes.ItemSelectionChangedEvent) {
    this.treeBoxValue = e.component.getSelectedNodeKeys();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTreeViewModule,
    DxDropDownBoxModule,
    HttpClientModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
