import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service, Employee, State } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

type FirstArgument<T> = T extends (...args: any) => any ? Parameters<T>[0]: never;

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  employees: Employee[];

  states: State[];

  constructor(private service: Service) {
    this.employees = service.getEmployees();
    this.states = service.getStates();
  }

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

  onCloneIconClick = (e: DxDataGridTypes.ColumnButtonClickEvent) => {
    const clonedItem = { ...e.row.data, ID: this.service.getMaxID() };

    this.employees.splice(e.row.rowIndex, 0, clonedItem);
    e.event.preventDefault();
  };
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
