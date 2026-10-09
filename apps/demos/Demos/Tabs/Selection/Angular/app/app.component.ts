import {
  Component,
  enableProdMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxTabsModule, DxSelectBoxModule, DxMultiViewModule } from 'devextreme-angular';
import { Tab, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxTabsModule,
    DxMultiViewModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  employees: Tab[];

  selectedItem: Tab;

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.selectedItem = this.employees[0];
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
