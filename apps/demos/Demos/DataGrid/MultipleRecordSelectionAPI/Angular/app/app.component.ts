import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, Pipe, PipeTransform, enableProdMode, inject, signal,
} from '@angular/core';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule } from 'devextreme-angular';
import { Service, Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Pipe({ name: 'stringifyEmployees', standalone: true })
export class StringifyEmployeesPipe implements PipeTransform {
  transform(employees: Employee[]) {
    return employees.map((employee) => `${employee.FirstName} ${employee.LastName}`).join(', ');
  }
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxDataGridModule,
    DxButtonModule,
    DxSelectBoxModule,
    StringifyEmployeesPipe,
  ],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  readonly prefix = signal<string | null>(null);

  readonly prefixOptions: string[] = ['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'];

  readonly selectedRows = signal<number[]>([]);

  private selectionChangedBySelectBox = false;

  filterSelected(event) {
    this.selectionChangedBySelectBox = true;

    const prefix = event.value;

    if (!prefix) { return; }
    if (prefix === 'All') { this.selectedRows.set(this.employees.map((employee) => employee.ID)); } else {
      this.selectedRows.set(this.employees.filter((employee) => employee.Prefix === prefix).map((employee) => employee.ID));
    }

    this.prefix.set(prefix);
  }

  selectionChangedHandler() {
    if (!this.selectionChangedBySelectBox) {
      this.prefix.set(null);
    }

    this.selectionChangedBySelectBox = false;
  }
}

bootstrapApplication(AppComponent);
