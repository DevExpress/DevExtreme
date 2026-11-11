import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxButtonModule, DxLoadPanelModule, DxCheckBoxModule } from 'devextreme-angular';

import { Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxButtonModule,
    DxLoadPanelModule,
    DxCheckBoxModule,
  ],
})

export class AppComponent {
  private readonly employee = inject(Service).getEmployee();

  readonly employeeInfo = signal(new Employee());

  readonly loadingVisible = signal(false);

  onShown() {
    setTimeout(() => {
      this.loadingVisible.set(false);
    }, 3000);
  }

  onHidden() {
    this.employeeInfo.set(this.employee);
  }

  showLoadPanel() {
    this.employeeInfo.set(new Employee());
    this.loadingVisible.set(true);
  }
}

bootstrapApplication(AppComponent);
