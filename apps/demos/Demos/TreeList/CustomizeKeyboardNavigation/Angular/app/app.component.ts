import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxButtonModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import { Service, Employee } from './app.service';

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
    DxButtonModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  employees: Employee[];

  editOnKeyPress = true;

  enterKeyActions: DxTreeListTypes.EnterKeyAction[];

  enterKeyDirections: DxTreeListTypes.EnterKeyDirection[];

  enterKeyAction: DxTreeListTypes.EnterKeyAction = 'moveFocus';

  enterKeyDirection: DxTreeListTypes.EnterKeyDirection = 'column';

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.enterKeyActions = service.getEnterKeyActions();
    this.enterKeyDirections = service.getEnterKeyDirections();
  }

  onFocusedCellChanging(e: DxTreeListTypes.FocusedCellChangingEvent) {
    e.isHighlighted = true;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
