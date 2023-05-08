import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxTreeListModule, DxButtonModule, DxCheckBoxModule, DxSelectBoxModule,
} from 'devextreme-angular';
import { Service, Employee } from './app.service';

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
  employees: Employee[];

  enterKeyActions: Array<string>;

  enterKeyDirections: Array<string>;

  editOnkeyPress: boolean;

  enterKeyAction: string;

  enterKeyDirection: string;

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.enterKeyActions = service.getEnterKeyActions();
    this.enterKeyDirections = service.getEnterKeyDirections();
    this.editOnkeyPress = true;
    this.enterKeyAction = 'moveFocus';
    this.enterKeyDirection = 'column';
  }

  onFocusedCellChanging(e) {
    e.isHighlighted = true;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTreeListModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
