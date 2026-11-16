import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type FirstArgument<T> = T extends (...args: any) => any ? Parameters<T>[0] : never;

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [
    DxDataGridModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly employees = signal(this.service.getEmployees());

  readonly states = this.service.getStates();

  private static isChief(position: string) {
    return position && ['CEO', 'CMO'].indexOf(position.trim().toUpperCase()) >= 0;
  }

  isCloneIconVisible({ row }: FirstArgument<DxDataGridTypes.ColumnButton['visible']>) {
    return !row.isEditing;
  }

  isCloneIconDisabled({ row }: FirstArgument<DxDataGridTypes.ColumnButton['disabled']>) {
    return AppComponent.isChief((row.data).Position);
  }

  isDeleteIconVisible({ row }: FirstArgument<DxDataGridTypes.Editing['allowDeleting']>) {
    return !AppComponent.isChief((row.data as Record<string, string>).Position);
  }

  onRowValidating(e: DxDataGridTypes.RowValidatingEvent) {
    const position = e.newData.Position as string;

    if (AppComponent.isChief(position)) {
      e.errorText = `The company can have only one ${position.toUpperCase()}. Please choose another position.`;
      e.isValid = false;
    }
  }

  onEditorPreparing(e: DxDataGridTypes.EditorPreparingEvent) {
    if (e.parentType === 'dataRow' && e.dataField === 'Position') {
      e.editorOptions.readOnly = AppComponent.isChief(e.value);
    }
  }

  readonly onCloneIconClick = (e: DxDataGridTypes.ColumnButtonClickEvent) => {
    const clonedItem = { ...e.row.data, ID: this.service.getMaxID() };

    this.employees.update((employees) => [
      ...employees.slice(0, e.row.rowIndex),
      clonedItem,
      ...employees.slice(e.row.rowIndex),
    ]);
    e.event.preventDefault();
  };
}

bootstrapApplication(AppComponent);
