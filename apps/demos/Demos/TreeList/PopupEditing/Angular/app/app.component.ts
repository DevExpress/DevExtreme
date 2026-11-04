import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
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
    DxTreeListModule,
  ],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  readonly lookupData = {
    store: this.employees,
    sort: 'Full_Name',
  };

  editorPreparing(e: DxTreeListTypes.EditorPreparingEvent) {
    if (e.dataField === 'Head_ID' && e.row.data.ID === 1) {
      e.editorOptions.disabled = true;
      e.editorOptions.value = null;
    }
  }

  initNewRow(e: DxTreeListTypes.InitNewRowEvent) {
    e.data.Head_ID = 1;
  }

  readonly allowDeleting = ({ row }) => row.data.ID !== 1;
}

bootstrapApplication(AppComponent);
