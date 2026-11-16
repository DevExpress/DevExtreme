import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxPopupModule, DxDiagramModule, DxTextBoxModule, DxButtonModule,
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
    DxTextBoxModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  readonly currentEmployee = signal<Employee>(new Employee());

  readonly popupVisible = signal(false);

  private generatedID = 100;

  readonly dataSource = new ArrayStore({
    key: 'ID',
    data: inject(Service).getEmployees(),
    onInserting: (values) => {
      values.ID = values.ID || (this.generatedID += 1);
      values.Full_Name = values.Full_Name || "Employee's Name";
      values.Title = values.Title || "Employee's Title";
    },
  });

  itemTypeExpr(obj, value) {
    if (value === undefined) {
      return 'employee';
    }
    obj.type = value;
    return null;
  }

  itemCustomDataExpr(obj, value) {
    if (value === undefined) {
      return {
        Full_Name: obj.Full_Name,
        Prefix: obj.Prefix,
        Title: obj.Title,
        City: obj.City,
        State: obj.State,
        Email: obj.Email,
        Skype: obj.Skype,
        Mobile_Phone: obj.Mobile_Phone,
      };
    }
    obj.Full_Name = value.Full_Name;
    obj.Prefix = value.Prefix;
    obj.Title = value.Title;
    obj.City = value.City;
    obj.State = value.State;
    obj.Email = value.Email;
    obj.Skype = value.Skype;
    obj.Mobile_Phone = value.Mobile_Phone;
    return null;
  }

  requestLayoutUpdateHandler(e) {
    for (let i = 0; i < e.changes.length; i += 1) {
      if (e.changes[i].type === 'remove') { e.allowed = true; } else if (e.changes[i].data.Head_ID !== undefined && e.changes[i].data.Head_ID !== null) { e.allowed = true; }
    }
  }

  editEmployee(employee: Employee) {
    this.currentEmployee.set({ ...employee });
    this.popupVisible.set(true);
  }

  deleteEmployee(employee) {
    this.dataSource.push([{ type: 'remove', key: employee.ID }]);
  }

  updateEmployee() {
    const employee = this.currentEmployee();
    this.dataSource.push([{
      type: 'update',
      key: employee.ID,
      data: {
        Full_Name: employee.Full_Name,
        Title: employee.Title,
        City: employee.City,
        State: employee.State,
        Email: employee.Email,
        Skype: employee.Skype,
        Mobile_Phone: employee.Mobile_Phone,
      },
    }]);
    this.popupVisible.set(false);
  }

  cancelEditEmployee() {
    this.currentEmployee.set(new Employee());
    this.popupVisible.set(false);
  }
}

bootstrapApplication(AppComponent);
