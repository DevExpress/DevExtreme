import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxButtonModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service, Employee, State } from './app.service';

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
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  states: State[];

  employees: Employee[];

  enterKeyActions: string[];

  enterKeyDirections: string[];

  editOnKeyPress = true;

  enterKeyAction: DxDataGridTypes.EnterKeyAction = 'moveFocus';

  enterKeyDirection: DxDataGridTypes.EnterKeyDirection = 'column';

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.states = service.getStates();
    this.enterKeyActions = service.getEnterKeyActions();
    this.enterKeyDirections = service.getEnterKeyDirections();
  }

  onFocusedCellChanging(e: DxDataGridTypes.FocusedCellChangingEvent) {
    e.isHighlighted = true;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
