import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxLookupModule } from 'devextreme-angular';

import { Service } from './app.service';
import type { Employee } from './app.service';

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
  readonly employees = inject(Service).getEmployees();

  getDisplayExpr(item: Employee | null) {
    if (!item) {
      return '';
    }

    return `${item.FirstName} ${item.LastName}`;
  }
}

bootstrapApplication(AppComponent);
