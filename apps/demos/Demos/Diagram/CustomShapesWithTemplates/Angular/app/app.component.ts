import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxPopupModule, DxDiagramModule,
} from 'devextreme-angular';
import { ArrayStore } from 'devextreme-angular/common/data';
import { Service, Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxDiagramModule,
    DxPopupModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly currentEmployee = signal<Employee>(new Employee());

  readonly employees: Employee[] = this.service.getEmployees();

  readonly dataSource = new ArrayStore({
    key: 'ID',
    data: this.service.getEmployees(),
  });

  readonly popupVisible = signal(false);

  itemTypeExpr(obj, value) {
    if (value === undefined) {
      return `employee${obj.ID}`;
    }
    obj.type = value;
    return null;
  }

  showInfo(employee: Employee) {
    this.currentEmployee.set(employee);
    this.popupVisible.set(true);
  }
}

bootstrapApplication(AppComponent);
