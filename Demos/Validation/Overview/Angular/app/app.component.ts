import { Component, NgModule, enableProdMode } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DxSelectBoxModule,
        DxCheckBoxModule,
        DxTextBoxModule,
        DxDateBoxModule,
        DxButtonModule,
        DxValidatorModule,
        DxValidationSummaryModule} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

import { Service } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

const sendRequest = function(value) {
    const validEmail = "test@dx-email.com";
    return new Promise((resolve) => {
        setTimeout(function() {
            resolve(value === validEmail);
        }, 1000);
    });    
}

@Component({
    selector: 'demo-app',
    providers: [Service],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})

export class AppComponent {
    password = "";
    maxDate: Date = new Date();
    cityPattern = "^[^0-9]+$";
    namePattern: any = /^[^0-9]+$/;
    phonePattern: any = /^\+\s*1\s*\(\s*[02-9]\d{2}\)\s*\d{3}\s*-\s*\d{4}$/;
    countries: string[];
    phoneRules: any = {
        X: /[02-9]/
    }
    constructor(service: Service) {
        this.maxDate = new Date(this.maxDate.setFullYear(this.maxDate.getFullYear() - 21));
        this.countries = service.getCountries();
    }
    passwordComparison = () => {
        return this.password;
    };
    checkComparison() {
        return true;
    }
    asyncValidation(params) {
        return sendRequest(params.value);
    }
    onFormSubmit = function(e) {
        notify({
            message: "You have submitted the form",
            position: {
                my: "center top",
                at: "center top"
            }
        }, "success", 3000);
        
        e.preventDefault();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSelectBoxModule,
        DxCheckBoxModule,
        DxTextBoxModule,
        DxDateBoxModule,
        DxButtonModule,
        DxValidatorModule,
        DxValidationSummaryModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);