import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxTreeListModule } from 'devextreme-angular';
import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
import { Employee, Service } from './app.service';

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
  employees: Employee[];

  editorOptions: DxTextBoxTypes.Properties = { placeholder: 'Search city or state' };

  searchExpr = ['City', 'State'];

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
