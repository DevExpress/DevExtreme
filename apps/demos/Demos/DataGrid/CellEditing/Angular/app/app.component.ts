import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import { ArrayStore } from 'devextreme-angular/common/data';
import { DxDataGridModule, DxDataGridComponent, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service } from './app.service';

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
    DxButtonModule,
  ],
})
export class AppComponent {
  private readonly dataGrid = viewChild.required(DxDataGridComponent);

  private readonly service = inject(Service);

  readonly dataSource = new ArrayStore({
    key: 'ID',
    data: this.service.getEmployees(),
  });

  readonly states = this.service.getStates();

  readonly selectedItemKeys = signal<string[]>([]);

  onSelectionChanged({ selectedRowKeys }: DxDataGridTypes.SelectionChangedEvent) {
    this.selectedItemKeys.set(selectedRowKeys);
  }

  deleteRecords() {
    this.selectedItemKeys().forEach((key) => {
      this.dataSource.remove(key);
    });
    this.dataGrid().instance.refresh();
  }
}

bootstrapApplication(AppComponent);
