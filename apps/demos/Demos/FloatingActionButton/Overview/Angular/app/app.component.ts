import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import config from 'devextreme/core/config';
import repaintFloatingActionButton from 'devextreme/ui/speed_dial_action/repaint_floating_action_button';
import { DxSpeedDialActionModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridComponent, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import {
  Service, Employee, State, directions,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
})
export class AppComponent {
  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;

  employees: Employee[];

  states: State[];

  directions = directions;

  selectedRowIndex = -1;

  constructor(private service: Service) {
    this.employees = service.getEmployees();
    this.states = service.getStates();
  }

  editRow() {
    this.grid.instance.editRow(this.selectedRowIndex);
    this.grid.instance.deselectAll();
  }

  deleteRow() {
    this.grid.instance.deleteRow(this.selectedRowIndex);
    this.grid.instance.deselectAll();
  }

  addRow() {
    this.grid.instance.addRow();
    this.grid.instance.deselectAll();
  }

  selectedChanged(e: DxDataGridTypes.SelectionChangedEvent) {
    this.selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
  }

  directionChanged(e: DxSelectBoxTypes.SelectionChangedEvent) {
    config({
      floatingActionButtonConfig: this.directions[e.selectedItem],
    });

    repaintFloatingActionButton();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule,
    DxSpeedDialActionModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
