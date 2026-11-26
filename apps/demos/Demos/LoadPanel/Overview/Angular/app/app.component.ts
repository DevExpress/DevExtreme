import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxButtonModule, DxLoadPanelModule, DxCheckBoxModule } from 'devextreme-angular';

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
  preserveWhitespaces: true,
  imports: [
    DxButtonModule,
    DxLoadPanelModule,
    DxCheckBoxModule,
  ],
})

export class AppComponent {
  private readonly employee = inject(Service).getEmployee();

  readonly employeeInfo = signal<Employee | null>(null);

  readonly loadingVisible = signal(false);

  onShown(): void {
    setTimeout(() => {
      this.loadingVisible.set(false);
    }, 3000);
  }

  onHidden(): void {
    this.employeeInfo.set(this.employee);
  }

  showLoadPanel(): void {
    this.employeeInfo.set(null);
    this.loadingVisible.set(true);
  }
}

bootstrapApplication(AppComponent);
