import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import Guid from 'devextreme/core/guid';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type FirstArgument<T> = T extends (...args: any) => any ? Parameters<T>[0] : never;

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxDataGridModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly dataSource = inject(Service).getDataSource();

  readonly newRowPosition = signal<DxDataGridTypes.NewRowPosition>('viewportTop');

  readonly scrollingMode = signal<DxDataGridTypes.DataGridScrollMode>('standard');

  readonly changes = signal<Partial<DxDataGridTypes.DataChange>[]>([]);

  readonly editRowKey = signal<number | string | null>(null);

  readonly newRowPositionOptions: DxDataGridTypes.NewRowPosition[] = ['first', 'last', 'pageTop', 'pageBottom', 'viewportTop', 'viewportBottom'];

  readonly scrollingModeOptions: DxDataGridTypes.DataGridScrollMode[] = ['standard', 'virtual'];

  readonly onAddButtonClick = ({ row }: DxDataGridTypes.ColumnButtonClickEvent) => {
    const key = new Guid().toString();
    this.changes.set([{
      key,
      type: 'insert',
      insertAfterKey: row.key,
    }]);
    this.editRowKey.set(key);
  };

  isAddButtonVisible({ row }: FirstArgument<DxDataGridTypes.ColumnButton['visible']>) {
    return !row.isEditing;
  }

  async onRowInserted(e: DxDataGridTypes.RowInsertedEvent) {
    await e.component.navigateToRow(e.key);
  }
}

bootstrapApplication(AppComponent);
