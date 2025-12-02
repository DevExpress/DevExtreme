import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, ViewChild, provideZoneChangeDetection } from '@angular/core';
import { DxCardViewModule, DxCardViewComponent, DxButtonModule } from 'devextreme-angular';
import { AppService, Employee } from './app.service';

import notify from 'devextreme/ui/notify';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-expect-error
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxCardViewModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  @ViewChild(DxCardViewComponent, { static: true }) cardView: DxCardViewComponent;

  employees: Employee[];

  constructor(service: AppService) {
    this.employees = service.getEmployees();
  }

  imageExpr({ First_Name, Last_Name }: Employee): string {
    return `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`;
  }

  altExpr({ First_Name, Last_Name }: Employee): string {
    return `Photo of ${First_Name} ${Last_Name}`;
  }

  calculateFullName({ First_Name, Last_Name }: Employee): string {
    return `${First_Name} ${Last_Name}`;
  }

  calculateAddress({ State, City }: Employee): string {
    return `${City}, ${State}`;
  }

  showNotify(text: string) {
    notify({
      message: `The "${text}" button is clicked.`,
      maxWidth: 560,
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    AppService,
  ],
});
