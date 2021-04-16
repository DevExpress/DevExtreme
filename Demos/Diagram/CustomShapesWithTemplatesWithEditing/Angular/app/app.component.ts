

import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxPopupModule, DxTemplateModule, DxDiagramModule, DxDiagramComponent, DxTextBoxModule, DxButtonModule } from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
import { Service, Employee } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service],
    preserveWhitespaces: true
})
export class AppComponent {
    @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;

    currentEmployee: Employee = new Employee();
    employees: Employee[];
    dataSource: ArrayStore;
    popupVisible = false;
    generatedID = 100;

    constructor(service: Service) {
        var that = this;
        this.employees = service.getEmployees();
        this.dataSource = new ArrayStore({
            key: "ID",
            data: service.getEmployees(),
            onInserting: function(values) {
                values.ID = values.ID || that.generatedID++;
                values.Full_Name = values.Full_Name || "Employee's Name";
                values.Title = values.Title || "Employee's Title";
            }
        });
    }
    itemTypeExpr(obj) {
        return "employee";
    }
    itemCustomDataExpr(obj, value) {
        if(value === undefined) {
            return {
                "Full_Name": obj.Full_Name,
                "Prefix": obj.Prefix,
                "Title": obj.Title,
                "City": obj.City,
                "State": obj.State,
                "Email": obj.Email,
                "Skype": obj.Skype,
                "Mobile_Phone": obj.Mobile_Phone
            };
        } else {
            obj.Full_Name = value.Full_Name;
            obj.Prefix = value.Prefix;
            obj.Title = value.Title;
            obj.City = value.City;
            obj.State = value.State;
            obj.Email = value.Email;
            obj.Skype = value.Skype;
            obj.Mobile_Phone = value.Mobile_Phone;
        }
    }
    requestLayoutUpdateHandler(e) { 
        for(var i = 0; i < e.changes.length; i++) {
            if(e.changes[i].type === 'remove')
                e.allowed = true;
            else if(e.changes[i].data.Head_ID !== undefined && e.changes[i].data.Head_ID !== null)
                e.allowed = true;
        }
    } 
    editEmployee(employee) {
        this.currentEmployee = Object.assign({}, employee);
        this.popupVisible = true;
    }
    deleteEmployee(employee) {
        this.dataSource.push([{ type: 'remove', key: employee.ID }]);
    }
    updateEmployee() {
        this.dataSource.push([{ 
            type: 'update',
            key: this.currentEmployee.ID, 
            data: {
                "Full_Name": this.currentEmployee.Full_Name,
                "Title": this.currentEmployee.Title,
                "City": this.currentEmployee.City,
                "State": this.currentEmployee.State,
                "Email": this.currentEmployee.Email,
                "Skype": this.currentEmployee.Skype,
                "Mobile_Phone": this.currentEmployee.Mobile_Phone
            }
        }]);
        this.popupVisible = false;
    }
    cancelEditEmployee() {
        this.currentEmployee = new Employee();
        this.popupVisible = false;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDiagramModule,
        DxPopupModule,
        DxTextBoxModule,
        DxButtonModule,
        DxTemplateModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);