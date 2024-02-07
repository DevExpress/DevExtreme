import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxButtonModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service, Employee, State } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  states: State[];

  employees: Employee[];

  enterKeyActions: Array<string>;

  enterKeyDirections: Array<string>;

  editOnkeyPress = true;

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

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
