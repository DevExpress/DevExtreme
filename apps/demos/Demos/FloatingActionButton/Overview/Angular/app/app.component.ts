import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import config from 'devextreme/core/config';
import repaintFloatingActionButton from 'devextreme/ui/speed_dial_action/repaint_floating_action_button';
import { DxSpeedDialActionModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridComponent, type DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { DxSelectBoxModule, type DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service, directions } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxDataGridModule,
    DxSpeedDialActionModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  private readonly grid = viewChild.required(DxDataGridComponent);

  readonly employees = this.service.getEmployees();

  readonly states = this.service.getStates();

  readonly selectedRowIndex = signal(-1);

  editRow() {
    this.grid().instance.editRow(this.selectedRowIndex());
    this.grid().instance.deselectAll();
  }

  deleteRow() {
    this.grid().instance.deleteRow(this.selectedRowIndex());
    this.grid().instance.deselectAll();
  }

  addRow() {
    this.grid().instance.addRow();
    this.grid().instance.deselectAll();
  }

  selectedChanged(e: DxDataGridTypes.SelectionChangedEvent) {
    this.selectedRowIndex.set(e.component.getRowIndexByKey(e.selectedRowKeys[0]));
  }

  directionChanged(e: DxSelectBoxTypes.SelectionChangedEvent) {
    config({
      floatingActionButtonConfig: directions[e.selectedItem],
    });

    repaintFloatingActionButton();
  }
}

bootstrapApplication(AppComponent);
