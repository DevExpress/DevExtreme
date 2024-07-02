import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxButtonModule } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import { DxDataGridModule, DxDataGridComponent, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service, State } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
})
export class AppComponent {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  dataSource: ArrayStore;

  states: State[];

  selectedItemKeys: string[] = [];

  constructor(service: Service) {
    this.dataSource = new ArrayStore({
      key: 'ID',
      data: service.getEmployees(),
    });
    this.states = service.getStates();
  }

  onSelectionChanged({ selectedRowKeys }: DxDataGridTypes.SelectionChangedEvent) {
    this.selectedItemKeys = selectedRowKeys;
  }

  deleteRecords() {
    this.selectedItemKeys.forEach((key) => {
      this.dataSource.remove(key);
    });
    this.dataGrid.instance.refresh();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
