import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxLookupModule } from 'devextreme-angular';

import { Service, Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxLookupModule,
  ],
})
export class AppComponent {
  employees: Employee[];

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  getDisplayExpr(item) {
    if (!item) {
      return '';
    }

    return `${item.FirstName} ${item.LastName}`;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
