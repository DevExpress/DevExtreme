import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import {
  DxDropDownBoxModule,
  DxTreeViewModule,
  DxDataGridModule,
  DxTreeViewComponent,
} from 'devextreme-angular';

import CustomStore from 'devextreme/data/custom_store';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  @ViewChild(DxTreeViewComponent, { static: false }) treeView;

  treeDataSource: any;

  treeBoxValue: string[];

  gridDataSource: any;

  gridBoxValue: number[] = [3];

  constructor(http: HttpClient) {
    this.treeDataSource = this.makeAsyncDataSource(http, 'treeProducts.json');
    this.gridDataSource = this.makeAsyncDataSource(http, 'customers.json');
    this.treeBoxValue = ['1_1'];
  }

  makeAsyncDataSource(http, jsonFile) {
    return new CustomStore({
      loadMode: 'raw',
      key: 'ID',
      load() {
        return lastValueFrom(http.get(`../../../../data/${jsonFile}`));
      },
    });
  }

  onDropDownBoxValueChanged(e) {
    this.updateSelection(this.treeView && this.treeView.instance);
  }

  onTreeViewReady(e) {
    this.updateSelection(e.component);
  }

  updateSelection(treeView) {
    if (!treeView) return;

    if (!this.treeBoxValue) {
      treeView.unselectAll();
    }

    if (this.treeBoxValue) {
      this.treeBoxValue.forEach(((value) => {
        treeView.selectItem(value);
      }));
    }
  }

  onTreeViewSelectionChanged(e) {
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
