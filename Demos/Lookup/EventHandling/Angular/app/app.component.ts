import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxLookupModule } from 'devextreme-angular';

import { Service, Employee } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [Service],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    employees: Employee[];
    selectedEmployee: any;

    constructor(service: Service) {
        this.employees = service.getEmployees();
    }

    valueChanged(data) {
        this.selectedEmployee = data.value;
    }

    getDisplayExpr(item) {
        if(!item) {
            return "";
        }

        return item.FirstName + " " + item.LastName;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxLookupModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);