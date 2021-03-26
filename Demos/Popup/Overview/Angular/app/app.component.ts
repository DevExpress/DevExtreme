import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxPopupModule, DxButtonModule, DxTemplateModule } from 'devextreme-angular';
import { Employee, Service } from './app.service';
import notify from 'devextreme/ui/notify';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service]
})

export class AppComponent {
    currentEmployee: Employee = new Employee();
    employees: Employee[];
    popupVisible = false;
    emailButtonOptions: any;
    closeButtonOptions: any;
    positionOf: string;

    constructor(service: Service) {
        const that = this;
        this.employees = service.getEmployees();
        this.emailButtonOptions = {
            icon: "email",
            text: "Send",
            onClick: function(e) {
            	const message = `Email is sent to ${that.currentEmployee.FirstName} ${that.currentEmployee.LastName}`;
            	notify({
              	    message: message,
              	    position: {
                        my: "center top",
                        at: "center top"
                    }
            	}, "success", 3000);
            }
        };
        this.closeButtonOptions = {
            text: "Close",
            onClick: function(e) {
                that.popupVisible = false;
            }
        };
    }
    detailsButtonMouseEnter(id) {
        this.positionOf = `#image${id}`;
    }
    showInfo(employee) {
        this.currentEmployee = employee;
        this.popupVisible = true;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxPopupModule,
        DxButtonModule,
        DxTemplateModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
