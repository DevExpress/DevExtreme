import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxCardViewModule, DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { type Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxCardViewModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  readonly columnChooserMode = signal('select');

  readonly allowColumnReordering = signal(false);

  readonly searchEnabled = signal(true);

  readonly allowSelectAll = signal(true);

  readonly selectByClick = signal(true);

  altExpr({ First_Name, Last_Name }: Employee): string {
    return `Photo of ${First_Name} ${Last_Name}`;
  }

  imageExpr({ First_Name, Last_Name }: Employee): string {
    return `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`;
  }

  calculateFullName({ First_Name, Last_Name }: Employee): string {
    return `${First_Name} ${Last_Name}`;
  }
}

bootstrapApplication(AppComponent);
