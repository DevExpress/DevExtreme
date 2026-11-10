import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxPopupModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
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
    DxPopupModule,
    DxButtonModule,
  ],
})

export class AppComponent {
  readonly currentEmployee = signal<Employee>(new Employee());

  readonly employees = inject(Service).getEmployees();

  readonly popupVisible = signal(false);

  readonly positionOf = signal<string>(undefined);

  readonly moreInfoButtonOptions: Record<string, unknown> = {
    text: 'More info',
    onClick: () => {
      const { FirstName, LastName } = this.currentEmployee();
      const message = `More info about ${FirstName} ${LastName}`;
      notify({
        message,
        position: {
          my: 'center top',
          at: 'center top',
        },
      }, 'success', 3000);
    },
  };

  readonly emailButtonOptions: Record<string, unknown> = {
    icon: 'email',
    stylingMode: 'contained',
    text: 'Send',
    onClick: () => {
      const { FirstName, LastName } = this.currentEmployee();
      const message = `Email is sent to ${FirstName} ${LastName}`;
      notify({
        message,
        position: {
          my: 'center top',
          at: 'center top',
        },
      }, 'success', 3000);
    },
  };

  readonly closeButtonOptions: Record<string, unknown> = {
    text: 'Close',
    stylingMode: 'outlined',
    type: 'normal',
    onClick: () => {
      this.popupVisible.set(false);
    },
  };

  detailsButtonMouseEnter(id: number) {
    this.positionOf.set(`#image${id}`);
  }

  showInfo(employee: Employee) {
    this.currentEmployee.set(employee);
    this.popupVisible.set(true);
  }
}

bootstrapApplication(AppComponent);
